# Xano Lambda – Step-by-step

**What we're doing:**
Your app sends a login token from Memberstack when it talks to Xano.
We add a small program (Lambda) in Xano that reads the token and tells Xano who the user is.

**What you need:**
Xano account open in a browser.
Memberstack secret key (starts with `sk_` or `sk_sb_`).
Get it from Memberstack: your app → Settings → API.

---

## Full list of steps

1. Log in to Xano (xano.io).


2. Open your workspace (the one for this app).


3. Go to Settings (gear or menu in Xano).


4. Find "Manage" or "Environment variables" or "Variables".


5. Click "Add variable" or "+ Variable".


6. In the Name field type exactly: MEMBERSTACK_SECRET_KEY


7. In the Value field paste your Memberstack secret key (starts with sk_ or sk_sb_).


8. Do not use the public key.


9. Save the variable.


10. In Xano find where API or API groups live (often left menu).


11. Find "Middleware" (under API or in its own section).


12. Open the middleware you use for Memberstack (e.g. "Memberstack JWT auth").


13. Make sure you are in the visual editor (blocks you can click), not only code.


14. Look at the steps from top to bottom.


15. Note if you already have a step that builds an object with "headers" and "secret". If not we will add it.


16. Find the step called "Get environment variables" or "Get env".


17. Add a new step between "Get env" and the Lambda step. Click Add step or + or Add block.


18. Choose a step type that builds an object or sets variables.


19. Look for "Set variable" or "Build object" or "Add variable" or "Object".


20. In that new step set "headers" = request headers.


21. Use whatever Xano shows: e.g. middleware input, or vars.http_headers, or request headers.


22. In the same step set "secret" = the output of the previous step (Get env) → MEMBERSTACK_SECRET_KEY.


23. Or use MEMBERSTACK_API_KEY if that is the name you used in step 6.


24. Give the output of this step a name (e.g. context or lambda_input). You will use this name in the Lambda step.


25. Click on the Lambda step (or "Run custom code").


26. Find where it says Input or Parameters or Arguments.


27. Set the Lambda input to the output from step 24 (e.g. context). One object with headers and secret inside it.


28. In the Lambda step find the code or script box.


29. Select all the code in the box and delete it.


30. Paste the script from the end of this file (the big code block). Copy the whole script from the first line to the last line.


31. Make sure the Lambda output is named (e.g. auth_result).


32. Save the Lambda step.


33. Find the first precondition step after the Lambda (a "stop if" step).


34. It should run when auth_result.error is not null.


35. It should set response to unauthorized and use the message auth_result.error.


36. Find the second precondition step after the Lambda.


37. It should run when auth_result.member_id is null.


38. It should set response to unauthorized (message can be "Unauthorized").


39. Find the step that sets the final response when everything is OK.


40. It should merge into the response: auth_member_id = auth_result.member_id.


41. Save the middleware.


42. If Xano has a Publish or Deploy button click it so changes go live.


43. Open your app in the browser.


44. Log in with Memberstack in the app.


45. Do something that calls the Xano API (e.g. load dashboard or profile).


46. If you get data it worked.


47. If you get "Unauthorized" send me a screenshot or the exact error and we fix it.

---

## Script to paste in the Lambda (step 25)

Copy everything below from the first line to the last line and paste into the Lambda code box.

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

---

When you finish a step or get stuck send me what you see (screenshot or text).
I will tell you what to do next and give you the full remaining steps again.
