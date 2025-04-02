package org.curiouslearning.container;

import com.rusticisoftware.tincan.*;
import com.rusticisoftware.tincan.lrsresponses.*;
import com.rusticisoftware.tincan.v10x.StatementsQuery;
import com.rusticisoftware.tincan.lrsresponses.StatementsResultLRSResponse;
import android.util.Base64;
import android.util.Log;

public class XAPIManager {
    private static final String TAG = "XAPIManager";
    // Your LRS details (replace with real values)
    private static final String LRS_ENDPOINT = "https://curious-reader.lrs.io/xapi/";
    private static final String LRS_USERNAME = "chimp";
    private static final String LRS_PASSWORD = "chimpoo";

    private RemoteLRS lrs;
    public XAPIManager() {
        try {
            lrs = new RemoteLRS();
            lrs.setEndpoint(LRS_ENDPOINT);
            lrs.setVersion(TCAPIVersion.V100);  // Set xAPI version explicitly
            // Encode username & password for authentication
            String authString = "Basic " + Base64.encodeToString(
                    (LRS_USERNAME + ":" + LRS_PASSWORD).getBytes(), Base64.NO_WRAP);
            lrs.setAuth(authString);
        } catch (Exception e) {
            Log.e(TAG, "Error initializing LRS: " + e.getMessage());
        }
    }

    /**
     * Send xAPI Statement
     */
    public void sendXAPIStatement(String userEmail, String verbId, String verbDisplay, String activityId, String activityName) {
        try {
            // Define Actor (User)
            Agent actor = new Agent();
            actor.setMbox("mailto:" + userEmail);

            // Define Verb (Action)
            Verb verb = new Verb(verbId);
            verb.setDisplay(new LanguageMap());
            verb.getDisplay().put("en-US", verbDisplay);

            // Define Activity (Object)
            Activity activity = new Activity(activityId);
            activity.setDefinition(new ActivityDefinition());
            activity.getDefinition().setName(new LanguageMap());
            activity.getDefinition().getName().put("en-US", activityName);

            // Create Statement
            Statement statement = new Statement(actor, verb, activity);

            // Send Statement to LRS
            StatementLRSResponse response = lrs.saveStatement(statement);

            // Check response
            if (response.getSuccess()) {
                Log.d(TAG, "xAPI Statement sent successfully: " + response.getContent().getId());
            } else {
                Log.e(TAG, "Failed to send xAPI Statement: " + response.getErrMsg());
            }
        } catch (Exception e) {
            Log.e(TAG, "Error sending xAPI statement: " + e.getMessage());
        }
    }

    /**
     * Retrieve xAPI Statements
     */
    public void retrieveXAPIStatements() {
        try {
            StatementsQuery query = new StatementsQuery();
            query.setLimit(5); // Retrieve last 5 statements

            StatementsResultLRSResponse response = lrs.queryStatements(query);
            if (response.getSuccess()) {
                Log.d(TAG, "Retrieved xAPI Statements:");
                for (Statement statement : response.getContent().getStatements()) {
                    Log.d(TAG, "Statement: " + statement.toJSON());
                }
            } else {
                Log.e(TAG, "Error retrieving xAPI statements: " + response.getErrMsg());
            }
        } catch (Exception e) {
            Log.e(TAG, "Exception retrieving xAPI statements: " + e.getMessage());
        }
    }
}
