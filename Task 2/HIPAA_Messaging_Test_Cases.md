# Manual Test Cases for HIPAA-Compliant Messaging System

---

## Acceptance Criteria 1: Only authenticated users can send/receive messages within the system.

### Test Case 1.1: Successful Message Transmission (Happy Path - Authenticated User)
*   **Test Case ID:** TC_HIPAA_MSG_001
*   **Title:** Send and receive a secure message between two authenticated users.
*   **Preconditions:**
    *   User A (Authenticated) is logged in.
    *   User B (Authenticated) is logged in.
    *   Both users have active, valid sessions.
*   **Test Steps:**
    1.  User A composes a new message to User B.
    2.  User A enters randomized sample message content (e.g., "Hello User B, this is a secure message. Testing special characters !@#$%^&*()_+ and emojis 😂👍").
    3.  User A sends the message.
    4.  User B logs in (if not already) and navigates to their inbox.
    5.  User B opens the message from User A.
*   **Test Data:**
    *   User A Credentials: `authenticated_user_A@example.com`, `SecurePassword1!`
    *   User B Credentials: `authenticated_user_B@example.com`, `SecurePassword2!`
    *   Message Content: Randomized sample text including alphanumeric, special characters, and emojis.
*   **Expected Results:**
    *   User A's message is successfully sent.
    *   User B receives the message in their inbox.
    *   The message content is displayed accurately and completely for User B.
    *   No error messages or warnings are displayed during transmission or receipt.
*   **Priority:** High
*   **Tags:** security, authentication, happy path, message transmission

### Test Case 1.2: Message Transmission - Unauthenticated User Access (Negative Path)
*   **Test Case ID:** TC_HIPAA_MSG_002
*   **Title:** Attempt to send a message as an unauthenticated user.
*   **Preconditions:**
    *   User is not logged in (guest user).
*   **Test Steps:**
    1.  Attempt to access the messaging system's "Compose Message" feature directly via URL or UI if accessible.
    2.  If a compose message interface is loaded, attempt to enter message content and send it.
*   **Test Data:** N/A (unauthenticated state)
*   **Expected Results:**
    *   The user is redirected to the login page immediately upon attempting to access messaging features.
    *   If a compose message UI is somehow loaded, the "Send" button is disabled or an error message prevents sending due to lack of authentication.
    *   No message is sent or received.
*   **Priority:** High
*   **Tags:** security, authentication, negative path, access control

### Test Case 1.3: Message Transmission - Invalid Session (Negative Path)
*   **Test Case ID:** TC_HIPAA_MSG_003
*   **Title:** Attempt to send a message with an invalid or expired session.
*   **Preconditions:**
    *   User is logged in.
    *   User session has expired or been invalidated (e.g., administrator forced logout, session timeout).
*   **Test Steps:**
    1.  User logs in and navigates to the messaging system.
    2.  Invalidate the user's session (simulate session expiry by waiting for idle timeout or via admin action).
    3.  User attempts to compose and send a message.
*   **Test Data:**
    *   User Credentials: `test_user@example.com`, `Password123!`
    *   Session Invalidation: Simulate a 5-minute idle timeout or immediate admin logout.
*   **Expected Results:**
    *   The system detects the invalid session.
    *   The user is immediately redirected to the login page or prompted to re-authenticate.
    *   The message sending attempt fails with an appropriate error message (e.g., "Session expired. Please log in again.").
    *   No message is sent or received.
*   **Priority:** High
*   **Tags:** security, session management, negative path, authentication

---

## Acceptance Criteria 2: Messages must be encrypted in transit and at rest.

### Test Case 2.1: In-transit Encryption Verification (Happy Path)
*   **Test Case ID:** TC_HIPAA_MSG_004
*   **Title:** Verify messages are encrypted during transmission (in-transit).
*   **Preconditions:**
    *   System is configured to use HTTPS/TLS for all communication.
    *   Network monitoring tools (e.g., Wireshark) are available.
*   **Test Steps:**
    1.  Start network traffic capture.
    2.  Authenticated User A sends a message to User B (e.g., "This message should be encrypted during transit.").
    3.  Stop network traffic capture.
    4.  Analyze the captured network packets.
*   **Test Data:**
    *   User A Credentials: `user_a_encrypt@example.com`, `EncryptPass!`
    *   Message Content: "This message contains sensitive info: Patient ID 12345."
*   **Expected Results:**
    *   All message payloads in the captured traffic are unreadable/encrypted (garbled text) and transmitted over HTTPS (port 443).
    *   No plaintext message content is visible in the network trace.
*   **Priority:** High
*   **Tags:** security, encryption, data privacy, network, happy path

### Test Case 2.2: At-rest Encryption Verification (Happy Path)
*   **Test Case ID:** TC_HIPAA_MSG_005
*   **Title:** Verify messages are encrypted when stored (at rest).
*   **Preconditions:**
    *   Database/storage access with appropriate tools (e.g., database client, file system access).
*   **Test Steps:**
    1.  Authenticated User A sends a message to User B.
    2.  Access the backend database or storage where messages are persisted.
    3.  Locate the stored message content.
*   **Test Data:**
    *   User A Credentials: `user_a_atrest@example.com`, `AtRestPass!`
    *   Message Content: "Patient Name: Jane Doe, Diagnosis: Flu." (Sample PHI)
*   **Expected Results:**
    *   The stored message content in the database/storage is unreadable/encrypted (hashed or gibberish).
    *   No plaintext message content (especially PHI) is visible in the database records or storage files.
*   **Priority:** High
*   **Tags:** security, encryption, data privacy, database, happy path

---

## Acceptance Criteria 3: PHI (Patient Health Information) must never be exposed in logs or browser cache.

### Test Case 3.1: PHI Redaction in Server Logs (Negative Path)
*   **Test Case ID:** TC_HIPAA_MSG_006
*   **Title:** Verify PHI is not exposed in server-side application logs.
*   **Preconditions:**
    *   Access to server-side application logs.
*   **Test Steps:**
    1.  Authenticated User A sends a message to User B containing sample PHI.
    2.  Access the server logs (e.g., application logs, web server logs).
    3.  Search for the sent message content and PHI within the logs.
*   **Test Data:**
    *   User A Credentials: `logger_test@example.com`, `LogTest123`
    *   Message Content: "This message contains PHI: Patient Name: John Smith, DOB: 01/01/1980, Medication: Aspirin, Diagnosis: Hypertension." (Randomized sample PHI)
*   **Expected Results:**
    *   The actual PHI (Patient Name, DOB, Medication, Diagnosis) is not present in plaintext in any server logs.
    *   PHI should be redacted, masked, or replaced with placeholders (e.g., `[PHI]`, `***`) in the logs.
*   **Priority:** Critical
*   **Tags:** security, data privacy, logging, PHI, negative path, audit

### Test Case 3.2: PHI Redaction in Browser Cache/Local Storage (Negative Path)
*   **Test Case ID:** TC_HIPAA_MSG_007
*   **Title:** Verify PHI is not stored in browser cache or local storage.
*   **Preconditions:**
    *   Browser developer tools are available.
*   **Test Steps:**
    1.  Authenticated User A sends and receives messages containing sample PHI.
    2.  Open browser developer tools (e.g., Chrome DevTools, Firefox Developer Tools).
    3.  Navigate to "Application" tab (for Local Storage, Session Storage, IndexedDB, Cache Storage) and "Network" tab (for cached responses).
    4.  Search for the sent/received message content and PHI within these storage areas.
*   **Test Data:**
    *   User A Credentials: `browser_cache_test@example.com`, `CacheCheck!`
    *   Message Content: "PHI Data: Patient ID: 98765, Treatment: Chemotherapy, Doctor: Dr. House." (Randomized sample PHI)
*   **Expected Results:**
    *   No plaintext PHI or sensitive message content is found in the browser's cache, local storage, session storage, or indexed databases.
    *   Sensitive data, if cached, should be encrypted or tokenized.
*   **Priority:** Critical
*   **Tags:** security, data privacy, browser cache, PHI, negative path

---

## Acceptance Criteria 4: Users can archive or delete their messages.

### Test Case 4.1: Message Archival (Happy Path)
*   **Test Case ID:** TC_HIPAA_MSG_008
*   **Title:** Successfully archive a message.
*   **Preconditions:**
    *   Authenticated user is logged in.
    *   User has existing messages in their inbox.
*   **Test Steps:**
    1.  User selects a message from their inbox.
    2.  User clicks the "Archive" button/option.
    3.  User navigates to the "Archived Messages" section.
*   **Test Data:**
    *   User Credentials: `archive_user@example.com`, `ArchPass123`
    *   Message to Archive: A standard message (e.g., "Meeting reminder for 3 PM.")
*   **Expected Results:**
    *   The message is successfully moved from the inbox to the "Archived Messages" section.
    *   The message is no longer visible in the inbox.
    *   The message content and metadata are preserved in the archive.
*   **Priority:** Medium
*   **Tags:** UI, data management, happy path, user functionality

### Test Case 4.2: Message Deletion - User (Happy Path)
*   **Test Case ID:** TC_HIPAA_MSG_009
*   **Title:** Successfully delete a message as a user.
*   **Preconditions:**
    *   Authenticated user is logged in.
    *   User has an existing message.
*   **Test Steps:**
    1.  User selects a message.
    2.  User clicks the "Delete" button/option.
    3.  Confirm the deletion when prompted (if applicable).
    4.  Attempt to search for the deleted message.
*   **Test Data:**
    *   User Credentials: `delete_user@example.com`, `DeletePass!`
    *   Message to Delete: "This is a test message to be deleted."
*   **Expected Results:**
    *   The message is successfully removed from the user's inbox and archive (if applicable).
    *   The deleted message is not retrievable by the user through any UI search or navigation.
    *   An audit log entry is created for the deletion (verified by admin in TC 5.3).
*   **Priority:** High
*   **Tags:** UI, data management, happy path, user functionality, audit

### Test Case 4.3: Message Deletion - Deleted Messages Not Retrievable (Negative Path)
*   **Test Case ID:** TC_HIPAA_MSG_010
*   **Title:** Verify deleted messages cannot be retrieved.
*   **Preconditions:**
    *   A message has been successfully deleted by a user.
*   **Test Steps:**
    1.  As the user who deleted the message, attempt to view the message using direct links, search, or browsing archived/deleted folders.
    2.  As another authenticated user, attempt to view the message (if it was a message involving them).
    3.  As an administrator, attempt to retrieve the *content* of the deleted message through any backdoor or administrative interface (should only see metadata, not content).
*   **Test Data:**
    *   Deleted Message ID.
    *   User A Credentials (who deleted the message).
    *   User B Credentials (if applicable).
    *   Admin Credentials.
*   **Expected Results:**
    *   The deleted message's content is permanently inaccessible to all users (including the deleting user and other involved parties).
    *   Administrators can see an audit trail that a message was deleted, but cannot view its content.
*   **Priority:** Critical
*   **Tags:** security, data privacy, deletion, negative path, data retention

---

## Acceptance Criteria 5: Admins can audit communication history by user, date, and content tag.
## Scenarios to cover: Permissions and access logs

### Test Case 5.1: Admin Audit Communication History - Filter by User (Happy Path)
*   **Test Case ID:** TC_HIPAA_MSG_011
*   **Title:** Admin successfully audits communication history filtered by a specific user.
*   **Preconditions:**
    *   Admin user is logged in.
    *   There is communication history for multiple users.
*   **Test Steps:**
    1.  Admin logs in to the system.
    2.  Admin navigates to the "Audit Logs" or "Communication History" section.
    3.  Admin selects a specific user from the filter options.
    4.  Admin applies the filter.
*   **Test Data:**
    *   Admin Credentials: `admin_user@example.com`, `AdminPass456!`
    *   User to filter by: `user_to_audit@example.com`
*   **Expected Results:**
    *   The audit log displays only communication events (send, receive, archive, delete) related to `user_to_audit@example.com`.
    *   The content of the messages should NOT be visible to the admin, only metadata (sender, receiver, timestamp, action type).
*   **Priority:** High
*   **Tags:** admin, audit, access control, happy path

### Test Case 5.2: Admin Audit Communication History - Filter by Date Range (Happy Path)
*   **Test Case ID:** TC_HIPAA_MSG_012
*   **Title:** Admin successfully audits communication history filtered by a date range.
*   **Preconditions:**
    *   Admin user is logged in.
    *   Communication history exists within and outside the specified date range.
*   **Test Steps:**
    1.  Admin logs in to the system.
    2.  Admin navigates to the "Audit Logs" section.
    3.  Admin specifies a start date and an end date for the filter.
    4.  Admin applies the filter.
*   **Test Data:**
    *   Admin Credentials: `admin_user@example.com`, `AdminPass456!`
    *   Date Range: `Start Date: [Current Date - 7 days]`, `End Date: [Current Date]`
*   **Expected Results:**
    *   The audit log displays only communication events that occurred within the specified date range.
    *   The content of the messages should NOT be visible to the admin.
*   **Priority:** High
*   **Tags:** admin, audit, data filtering, happy path

### Test Case 5.2.5: Admin Audit Communication History - Filter by Content Tag (Happy Path - Conceptual)
*   **Test Case ID:** TC_HIPAA_MSG_012.5
*   **Title:** Admin successfully audits communication history filtered by a content tag.
*   **Preconditions:**
    *   Admin user is logged in.
    *   Messages have been tagged with various categories (e.g., "urgent", "billing", "appointment"). (This implies a tagging feature exists.)
*   **Test Steps:**
    1.  Admin logs in to the system.
    2.  Admin navigates to the "Audit Logs" section.
    3.  Admin selects or enters a specific content tag (e.g., "appointment") for filtering.
    4.  Admin applies the filter.
*   **Test Data:**
    *   Admin Credentials: `admin_user@example.com`, `AdminPass456!`
    *   Content Tag: "appointment" (assuming messages were tagged with this, e.g., "Patient appointment reminder for 2 PM.")
*   **Expected Results:**
    *   The audit log displays only communication events related to messages that were tagged with "appointment".
    *   The content of the messages should NOT be visible to the admin.
*   **Priority:** Medium
*   **Tags:** admin, audit, data filtering, happy path, content tag

### Test Case 5.3: Normal User Access to Audit Logs (Negative Path)
*   **Test Case ID:** TC_HIPAA_MSG_013
*   **Title:** Verify normal users cannot access audit logs.
*   **Preconditions:**
    *   Normal authenticated user is logged in.
*   **Test Steps:**
    1.  Normal user attempts to access the "Audit Logs" or "Communication History" section directly via URL or UI navigation.
*   **Test Data:**
    *   Normal User Credentials: `normal_user@example.com`, `NormalPass!`
*   **Expected Results:**
    *   Normal user is denied access with an appropriate error message (e.g., "Access Denied" or "Unauthorized").
    *   The audit log page does not load for the normal user.
*   **Priority:** High
*   **Tags:** security, access control, negative path, authorization

### Test Case 5.4: Validate Access Log Entries for Send/Receive Actions (Happy Path)
*   **Test Case ID:** TC_HIPAA_MSG_014
*   **Title:** Verify send and receive message actions are logged in the audit trail.
*   **Preconditions:**
    *   Admin user is logged in and has access to audit logs.
    *   Authenticated users have sent and received messages.
*   **Test Steps:**
    1.  Authenticated User A sends a message to User B.
    2.  Admin logs in and navigates to the "Audit Logs" section.
    3.  Admin filters the logs to find events related to User A and User B around the message transmission time.
*   **Test Data:**
    *   User A Credentials: `log_sender@example.com`, `SenderPass`
    *   User B Credentials: `log_receiver@example.com`, `ReceiverPass`
    *   Message Content: "Audit log test message."
    *   Admin Credentials: `admin_user@example.com`, `AdminPass456!`
*   **Expected Results:**
    *   An audit log entry exists for "Message Sent" by `log_sender@example.com` to `log_receiver@example.com`, including timestamp and message ID (but no content).
    *   An audit log entry exists for "Message Received" by `log_receiver@example.com` from `log_sender@example.com`, including timestamp and message ID (but no content).
*   **Priority:** High
*   **Tags:** audit, logging, happy path, compliance

### Test Case 5.5: Validate Access Log Entries for Delete Actions (Happy Path)
*   **Test Case ID:** TC_HIPAA_MSG_015
*   **Title:** Verify message deletion actions are logged in the audit trail.
*   **Preconditions:**
    *   Admin user is logged in and has access to audit logs.
    *   An authenticated user has deleted a message.
*   **Test Steps:**
    1.  Authenticated User A sends a message to User B.
    2.  User A deletes the message.
    3.  Admin logs in and navigates to the "Audit Logs" section.
    4.  Admin filters the logs to find events related to User A and the deleted message.
*   **Test Data:**
    *   User A Credentials: `log_deleter@example.com`, `DeleterPass`
    *   User B Credentials: `log_recipient@example.com`, `RecipientPass`
    *   Message Content: "Message to be deleted for audit."
    *   Admin Credentials: `admin_user@example.com`, `AdminPass456!`
*   **Expected Results:**
    *   An audit log entry exists for "Message Deleted" by `log_deleter@example.com`, including timestamp and the message ID (but no content).
*   **Priority:** High
*   **Tags:** audit, logging, happy path, compliance 