package org.curiouslearning.container;

import com.rusticisoftware.tincan.*;
import com.rusticisoftware.tincan.lrsresponses.*;
import com.rusticisoftware.tincan.v10x.StatementsQuery;
import com.rusticisoftware.tincan.lrsresponses.StatementsResultLRSResponse;
import android.util.Log;
import org.joda.time.DateTime;
import java.net.URISyntaxException;
import java.net.URI;
import java.util.UUID;


public class XAPIManager {
    private static final String TAG = "XAPIManager";
    // LRS details
    private static final String LRS_ENDPOINT = "https://curious-reader.lrs.io/xapi/";
    private static final String LRS_USERNAME = "chimp";
    private static final String LRS_PASSWORD = "chimpoo";

    private RemoteLRS lrs;

    public XAPIManager() {
        try {
            lrs = new RemoteLRS();
            lrs.setEndpoint(LRS_ENDPOINT);
            lrs.setVersion(TCAPIVersion.V100);  // Set xAPI version explicitly
            lrs.setUsername(LRS_USERNAME);
            lrs.setPassword(LRS_PASSWORD);

        } catch (Exception e) {
            Log.e(TAG, " Error initializing LRS: " + e.getMessage());
        }
    }

    /**
     * Send xAPI Statement
     */
    public void sendXAPIStatement() {
        
        try {
            // Define Actor
            Agent agent  = new Agent();
            agent.setMbox("mailto:info@tincanapi.com");
            agent.setName("CR");

            Verb verb = new Verb("http://adlnet.gov/expapi/verbs/attempted");
            verb.setDisplay(new LanguageMap());
            verb.getDisplay().put("en-US", "Completed");

            Activity activity = new Activity();
            activity.setId(new URI("http://tincanapi.com/TinCanJava/Test/Unit/0"));
            activity.setDefinition(new ActivityDefinition());
            activity.getDefinition().setType(new URI("http://id.tincanapi.com/activitytype/unit-test"));
            activity.getDefinition().setName(new LanguageMap());
            activity.getDefinition().getName().put("en-US", "TinCanJava Tests: Unit 0");

            Context context = new Context();
            context.setRegistration(UUID.randomUUID());

            // Create Statement
            Statement st = new Statement();
            st.setActor(agent);
            st.setVerb(verb);
            st.setObject(activity);
            st.setContext(context);
            st.setTimestamp(new DateTime());

            // Send Statement to LRS
            StatementLRSResponse lrsRes = lrs.saveStatement(st);
            // Check Response
            if (lrsRes != null && lrsRes.getSuccess()) {
                Log.d(TAG, "xAPI Statement sent successfully!" + lrsRes.getContent().getId());
            } else {
                Log.e(TAG, "Failed to send xAPI Statement: " + lrsRes.getErrMsg());
            }
        } catch (URISyntaxException e) {
            Log.e(TAG, "URI Syntax Exception: " + e.getMessage());
        }
    }

    /**
     * Retrieve xAPI Statements
     */
    public void retrieveXAPIStatements() {
        try {
            StatementsQuery query = new StatementsQuery();
            query.setLimit(10);  // Set query limit to 5
            StatementsResultLRSResponse response = lrs.queryStatements(query);

            if (response.getSuccess()) {
                Log.d(TAG, "Retrieved Statements: " + response.getContent().getStatements().size());
                for (Statement statement : response.getContent().getStatements()) {
                    Log.d(TAG, "Statement: " + statement.toJSON());
                }
            } else {
                Log.e(TAG, "Failed to retrieve statements: " + response.getErrMsg());
            }
        } catch (Exception e) {
            Log.e(TAG, "Exception retrieving xAPI statements: " + e.getMessage());
        }
    }
}
