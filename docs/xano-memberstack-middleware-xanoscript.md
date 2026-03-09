# Memberstack JWT auth middleware – XanoScript + Lambda

Use this in your Xano middleware (the one you created as “Memberstack JWT auth”) so it validates the Memberstack token and passes `auth_member_id` to your endpoints.

---

## 1. Environment variable in Xano

- In Xano: **Settings** → **Manage** (environment variables) → **+ Variable**.
- Name: `MEMBERSTACK_SECRET_KEY`
- Value: your Memberstack **secret** key (`sk_...` or `sk_sb_...` from [Memberstack Dashboard](https://app.memberstack.com) → your app → Settings → API).
- Save.

---

## 2. Lambda: “Verify Memberstack token”

In Xano: **Library** → **Functions** → **Add Function** (or add a **Lambda** block where you can run JavaScript).

Name it e.g. **Verify Memberstack token**.

**Critical — Lambda input:** The Lambda receives **one argument** (`input`). You must wire it so that object contains **both** request headers and the Memberstack secret. In the visual stack, add a step that builds that object (see section 3) and pass it as the Lambda's input. If you don't, the Lambda will return "Missing or invalid Authorization header".

**Lambda code (JavaScript) — copy this exactly:**

```javascript
// @ts-nocheck
async function verifyMemberstackToken(input) {
  var headers = (input && (input.headers || input.http_headers || (input.vars && (input.vars.http_headers || input.vars.headers)))) || {};
  var secret = (input && (input.secret || input.MEMBERSTACK_SECRET_KEY || input.MEMBERSTACK_API_KEY || (input.env && (input.env.MEMBERSTACK_SECRET_KEY || input.env.MEMBERSTACK_API_KEY)))) || '';
  var authHeader = headers.authorization || headers.Authorization || '';

  if (typeof authHeader !== 'string' || authHeader.indexOf('Bearer ') !== 0) {
    return { member_id: null, error: 'Missing or invalid Authorization header' };
  }

  var token = authHeader.substring(7).trim();
  if (!token) {
    return { member_id: null, error: 'Missing token' };
  }
  if (!secret) {
    return { member_id: null, error: 'Server misconfiguration' };
  }

  try {
    var res = await fetch('https://admin.memberstack.com/members/verify-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': secret
      },
      body: JSON.stringify({ token: token })
    });

    var status = res.status;
    var text = await res.text();

    if (status !== 200) {
      return { member_id: null, error: 'Invalid or expired token' };
    }

    var data = JSON.parse(text);
    // Memberstack API returns { data: { id: "mem_...", type: "member", ... } }
    var memberId = (data && data.data && data.data.id) || (data && (data.member_id || data.sub || data.id)) || null;
    if (!memberId) {
      return { member_id: null, error: 'Invalid token response' };
    }
    return { member_id: memberId, error: null };
  } catch (e) {
    return { member_id: null, error: 'Invalid token response' };
  }
}

return verifyMemberstackToken(input);
```

**Supported input shapes (so you can wire in different ways):**

- `input.headers` + `input.secret` (recommended when you build `{ headers, secret }` in a prior step)
- `input.http_headers` + `input.MEMBERSTACK_SECRET_KEY` or `input.MEMBERSTACK_API_KEY` (e.g. when passing `env` from Get Environment Variables and your env includes headers and the key)
- `input.vars` + `input.env` (when you pass `{ vars, env }` from the middleware)

**Note:** In Xano’s Lambda, the request might be done with their HTTP helper instead of `fetch`. If your Lambda runtime doesn’t support `fetch`, use Xano's HTTP request block to call `https://admin.memberstack.com/members/verify-token` (POST, header `x-api-key`, body `{ "token": "<extracted Bearer token>" }`) and pass the response body into a small script that does the `JSON.parse` and `data.data.id` extraction above.

---

## 3. XanoScript for the middleware

Open your **Memberstack JWT auth** middleware in Xano and switch to **XanoScript** (or build the same flow in the visual stack).

**Configuration (in the middleware modal):**

- **Response type:** Merge  
- **Exception:** Critical  

**XanoScript:** (If your Xano version doesn't pass request headers or env into the Lambda, use the visual stack in section 3 instead so you can build the Lambda input object.)

```java
// Validates Memberstack JWT from Authorization header; returns 401 if missing/invalid; merges auth_member_id for the endpoint.
middleware memberstack_jwt_auth {
  input {
    json vars
    enum type {
      values = ["pre", "post"]
    }
  }

  stack {
    util.get_env as env

    api.lambda {
      code = "async function verifyMemberstackToken(input){var headers=(input&&(input.headers||input.http_headers||(input.vars&&(input.vars.http_headers||input.vars.headers))))||{};var secret=(input&&(input.secret||input.MEMBERSTACK_SECRET_KEY||input.MEMBERSTACK_API_KEY||(input.env&&(input.env.MEMBERSTACK_SECRET_KEY||input.env.MEMBERSTACK_API_KEY))))||'';var authHeader=headers.authorization||headers.Authorization||'';if(typeof authHeader!=='string'||authHeader.indexOf('Bearer ')!==0){return{member_id:null,error:'Missing or invalid Authorization header'};}var token=authHeader.substring(7).trim();if(!token){return{member_id:null,error:'Missing token'};}if(!secret){return{member_id:null,error:'Server misconfiguration'};}try{var res=await fetch('https://admin.memberstack.com/members/verify-token',{method:'POST',headers:{'Content-Type':'application/json','x-api-key':secret},body:JSON.stringify({token:token})});var status=res.status;var text=await res.text();if(status!==200){return{member_id:null,error:'Invalid or expired token'};}var data=JSON.parse(text);var memberId=(data&&data.data&&data.data.id)||(data&&(data.member_id||data.sub||data.id))||null;if(!memberId){return{member_id:null,error:'Invalid token response'};}return{member_id:memberId,error:null};}catch(e){return{member_id:null,error:'Invalid token response'};}}return verifyMemberstackToken(input);"
      timeout = 10
    } as $auth_result

    precondition ($auth_result.error != null) {
      error_type = "unauthorized"
      error = $auth_result.error
    }

    precondition ($auth_result.member_id == null) {
      error_type = "unauthorized"
      error = "Unauthorized"
    }
  }

  response = { auth_member_id: $auth_result.member_id }
  response_strategy = "merge"
  exception_policy = "critical"
  tags = ["auth", "memberstack"]
}
```

**If your Xano version doesn’t support `params` on `api.lambda`:**  
Build the same flow in the **visual stack**:

1. **Get environment variables** – e.g. `util.get_env` → store as `env`.
2. **Build the Lambda input (required)** – The Lambda must receive an object with both request headers and the secret. Add a step that creates e.g. `context` = `{ "headers": <request headers>, "secret": env.MEMBERSTACK_SECRET_KEY }`. Request headers must come from the middleware input (e.g. `vars.http_headers`) or from whatever variable holds incoming request headers. If you only pass `env` and it doesn't expose request headers, the Lambda will return "Missing or invalid Authorization header".
3. **Lambda** – Set the Lambda **input** to the object from step 2 (e.g. `context`). Paste the JavaScript from section 2. Output as `auth_result`.
4. **Precondition** – if `auth_result.error` is not null → halt with error type **unauthorized** and message `auth_result.error`.
5. **Precondition** – if `auth_result.member_id` is null → halt with **unauthorized**.
6. **Response** – set response to **Merge** and return `{ auth_member_id: auth_result.member_id }`.

Then in the middleware configuration set **Exception** to **Critical**.

---

## 4. Using `auth_member_id` in your endpoints

After the middleware runs, the merged variable **`auth_member_id`** is available in the endpoint’s function stack.

- Use **`auth_member_id`** (and not the `email` from the URL/body) to decide which user’s data to load.
- For example: get user by `memberstack_id` = `auth_member_id`, then use that user record for dashboard, profile, game result, etc.

---

## 5. If Lambda can’t call `fetch`

If your Lambda runtime doesn’t support `fetch`:

1. In the middleware stack, get the Bearer token (e.g. from `$env.http_headers` with a small Lambda that only extracts `Authorization` and returns the token string).
2. Use **api.request** in XanoScript to call `https://admin.memberstack.com/members/verify-token`:
   - Method: POST  
   - Headers: `x-api-key: $env.MEMBERSTACK_SECRET_KEY`, `Content-Type: application/json`  
   - Body: `{"token": "<extracted token>"}`  
3. Precondition on response status (e.g. not 200) → return **unauthorized**.
4. Parse the response body (e.g. with another Lambda or a “Parse JSON” step) to get `member_id` (or `sub` / `id`) and merge that as `auth_member_id` in the response.

The logic is the same; only the way you do the HTTP call and JSON parse changes.
