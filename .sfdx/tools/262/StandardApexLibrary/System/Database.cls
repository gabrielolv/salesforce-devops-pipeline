/**
 * Contains methods for creating and manipulating data.
 */
global class Database {

  global Database() {}

  global static Database.LeadConvertResult convertLead(Database.LeadConvert leadToConvert, System.AccessLevel accessLevel) {}

  global static List<Database.LeadConvertResult> convertLead(List<Database.LeadConvert> leadConverts, System.AccessLevel accessLevel) {}

  global static Database.LeadConvertResult convertLead(Database.LeadConvert leadToConvert, Boolean allOrNone) {}

  global static Database.LeadConvertResult[] convertLead(Database.LeadConvert[] leadsToConvert, Boolean allOrNone) {}

  global static Database.LeadConvertResult convertLead(Database.LeadConvert leadToConvert, Database.DMLOptions dmlOptions) {}

  global static List<Database.LeadConvertResult> convertLead(List<Database.LeadConvert> leadsToConvert, Database.DMLOptions dmlOptions) {}

  global static Database.LeadConvertResult convertLead(Database.LeadConvert leadToConvert, Boolean allOrNone, System.AccessLevel accessLevel) {}

  global static List<Database.LeadConvertResult> convertLead(List<Database.LeadConvert> leadsToConvert, Boolean allOrNone, System.AccessLevel accessLevel) {}

  global static Database.LeadConvertResult convertLead(Database.LeadConvert leadToConvert, Database.DMLOptions dmlOptions, System.AccessLevel accessLevel) {}

  global static List<Database.LeadConvertResult> convertLead(List<Database.LeadConvert> leadsToConvert, Database.DMLOptions dmlOptions, System.AccessLevel accessLevel) {}

  /**
   * Returns the number of records that a dynamic SOQL query would return when executed.
   * @param query 
   * @return Integer
   */
  global static Integer countQuery(String query) {}

  /**
   * Returns the number of records that a dynamic SOQL query would return when executed.
   * @param query 
   * @param accessLevel 
   * @return Integer
   */
  global static Integer countQuery(String query, System.AccessLevel accessLevel) {}

  global static Integer countQueryWithBinds(String query, Map<String, Object> bindMap, System.AccessLevel accessLevel) {}


  /**
   * Initiates requests to delete the external data that corresponds to the specified external object records. The request is executed asynchronously, as a background operation, and is sent to the external system that's defined by the external object's associated external data source. Allows referencing a callback class whose processDelete method is called for each record after deletion.
   * @param sobjects List of external object records to delete.
   * @param callback The callback that contains the state in the originating context and an action (the processDelete method) that is executed after the insert operation is completed. Use the action callback to update org data according to the operation’s results. The callback object must extend DataSource.AsyncDeleteCallback .
   * @return List<Database.DeleteResult>
   */
  global static List<Database.DeleteResult> deleteAsync(List<SObject> sobjects, DataSource.AsyncDeleteCallback callback) {}

  /**
   * Initiates requests to delete the external data that corresponds to the specified external object records. The request is executed asynchronously, as a background operation, and is sent to the external system that's defined by the external object's associated external data source. Allows referencing a callback class whose processDelete method is called for each record after deletion.
   * @param sobject 
   * @param callback The callback that contains the state in the originating context and an action (the processDelete method) that is executed after the insert operation is completed. Use the action callback to update org data according to the operation’s results. The callback object must extend DataSource.AsyncDeleteCallback .
   * @return Database.DeleteResult
   */
  global static Database.DeleteResult deleteAsync(SObject sobject, DataSource.AsyncDeleteCallback callback) {}

  /**
   * Initiates requests to delete the external data that corresponds to the specified external object records. The request is executed asynchronously, as a background operation, and is sent to the external system that's defined by the external object's associated external data source. Allows referencing a callback class whose processDelete method is called for each record after deletion.
   * @param sobjects List of external object records to delete.
   * @return List<Database.DeleteResult>
   */
  global static List<Database.DeleteResult> deleteAsync(List<SObject> sobjects) {}

  /**
   * Initiates requests to delete the external data that corresponds to the specified external object records. The request is executed asynchronously, as a background operation, and is sent to the external system that's defined by the external object's associated external data source. Allows referencing a callback class whose processDelete method is called for each record after deletion.
   * @param sobject 
   * @return Database.DeleteResult
   */
  global static Database.DeleteResult deleteAsync(SObject sobject) {}

  /**
   * Initiates requests to delete the external data that corresponds to the specified external object records. The request is executed asynchronously, as a background operation, and is sent to the external system that's defined by the external object's associated external data source. Allows referencing a callback class whose processDelete method is called for each record after deletion.
   * @param sobjects List of external object records to delete.
   * @param callback The callback that contains the state in the originating context and an action (the processDelete method) that is executed after the insert operation is completed. Use the action callback to update org data according to the operation’s results. The callback object must extend DataSource.AsyncDeleteCallback .
   * @param accessLevel 
   * @return List<Database.DeleteResult>
   */
  global static List<Database.DeleteResult> deleteAsync(List<SObject> sobjects, DataSource.AsyncDeleteCallback callback, System.AccessLevel accessLevel) {}

  /**
   * Initiates requests to delete the external data that corresponds to the specified external object records. The request is executed asynchronously, as a background operation, and is sent to the external system that's defined by the external object's associated external data source. Allows referencing a callback class whose processDelete method is called for each record after deletion.
   * @param sobject 
   * @param callback The callback that contains the state in the originating context and an action (the processDelete method) that is executed after the insert operation is completed. Use the action callback to update org data according to the operation’s results. The callback object must extend DataSource.AsyncDeleteCallback .
   * @param accessLevel 
   * @return Database.DeleteResult
   */
  global static Database.DeleteResult deleteAsync(SObject sobject, DataSource.AsyncDeleteCallback callback, System.AccessLevel accessLevel) {}

  /**
   * Initiates requests to delete the external data that corresponds to the specified external object records. The request is executed asynchronously, as a background operation, and is sent to the external system that's defined by the external object's associated external data source. Allows referencing a callback class whose processDelete method is called for each record after deletion.
   * @param sobjects List of external object records to delete.
   * @param accessLevel 
   * @return List<Database.DeleteResult>
   */
  global static List<Database.DeleteResult> deleteAsync(List<SObject> sobjects, System.AccessLevel accessLevel) {}

  /**
   * Initiates requests to delete the external data that corresponds to the specified external object records. The request is executed asynchronously, as a background operation, and is sent to the external system that's defined by the external object's associated external data source. Allows referencing a callback class whose processDelete method is called for each record after deletion.
   * @param sobject 
   * @param accessLevel 
   * @return Database.DeleteResult
   */
  global static Database.DeleteResult deleteAsync(SObject sobject, System.AccessLevel accessLevel) {}

  /**
   * Initiates requests to delete the external data that corresponds to the specified external object records. The requests are executed synchronously and are sent to the external systems that are defined by the external objects' associated external data sources. If the Apex transaction contains pending changes, the synchronous operations can't be completed and throw exceptions.
   * @param sobjects List of external object records to delete.
   * @return List<Database.DeleteResult>
   */
  global static List<Database.DeleteResult> deleteImmediate(List<SObject> sobjects) {}

  /**
   * Initiates requests to delete the external data that corresponds to the specified external object records. The requests are executed synchronously and are sent to the external systems that are defined by the external objects' associated external data sources. If the Apex transaction contains pending changes, the synchronous operations can't be completed and throw exceptions.
   * @param sobject 
   * @return Database.DeleteResult
   */
  global static Database.DeleteResult deleteImmediate(SObject sobject) {}

  /**
   * Initiates requests to delete the external data that corresponds to the specified external object records. The requests are executed synchronously and are sent to the external systems that are defined by the external objects' associated external data sources. If the Apex transaction contains pending changes, the synchronous operations can't be completed and throw exceptions.
   * @param sobjects List of external object records to delete.
   * @param accessLevel 
   * @return List<Database.DeleteResult>
   */
  global static List<Database.DeleteResult> deleteImmediate(List<SObject> sobjects, System.AccessLevel accessLevel) {}

  /**
   * Initiates requests to delete the external data that corresponds to the specified external object records. The requests are executed synchronously and are sent to the external systems that are defined by the external objects' associated external data sources. If the Apex transaction contains pending changes, the synchronous operations can't be completed and throw exceptions.
   * @param sobject 
   * @param accessLevel 
   * @return Database.DeleteResult
   */
  global static Database.DeleteResult deleteImmediate(SObject sobject, System.AccessLevel accessLevel) {}

  /**
   * Permanently deletes the specified records from the Recycle Bin.
   * @param recordIds 
   * @return Database.EmptyRecycleBinResult[]
   */
  global static Database.EmptyRecycleBinResult[] emptyRecycleBin(ID [] recordIds) {}

  /**
   * Permanently deletes the specified records from the Recycle Bin.
   * @param obj 
   * @return Database.EmptyRecycleBinResult
   */
  global static Database.EmptyRecycleBinResult emptyRecycleBin(sObject obj) {}

  /**
   * Permanently deletes the specified records from the Recycle Bin.
   * @param listOfSObjects 
   * @return Database.EmptyRecycleBinResult[]
   */
  global static Database.EmptyRecycleBinResult[] emptyRecycleBin(sObject[] listOfSObjects) {}

  /**
   * Submits a batch Apex job for execution corresponding to the specified class.
   * @param batchClassObject An instance of a class that implements the Database.Batchable interface .
   * @return ID
   */
  global static ID executeBatch(Object batchClassObject) {}

  /**
   * Submits a batch Apex job for execution corresponding to the specified class.
   * @param batchClassObject An instance of a class that implements the Database.Batchable interface .
   * @param scope 
   * @return ID
   */
  global static ID executeBatch(Object batchClassObject, Integer scope) {}

  /**
   * Retrieves the status of an asynchronous delete operation that’s identified by a Database.DeleteResult object.
   * @param deleteResult The result record for the delete operation being retrieved.
   * @return Database.DeleteResult
   */
  global static Database.DeleteResult getAsyncDeleteResult(Database.DeleteResult deleteResult) {}

  /**
   * Retrieves the status of an asynchronous delete operation that’s identified by a Database.DeleteResult object.
   * @param asyncLocator 
   * @return Database.DeleteResult
   */
  global static Database.DeleteResult getAsyncDeleteResult(String asyncLocator) {}

  /**
   * Returns the asyncLocator associated with the result of a specified asynchronous insert, update, or delete operation.
   * @param result The saved result of an asynchronous insert, update, or delete operation. The result object can be of type Database.SaveResult or Database.DeleteResult .
   * @return String
   */
  global static String getAsyncLocator(Object result) {}

  /**
   * Returns the status of an asynchronous insert or update operation that’s identified by a Database.SaveResult object.
   * @param saveResult The result record for the insert or update operation being retrieved.
   * @return Database.SaveResult
   */
  global static Database.SaveResult getAsyncSaveResult(Database.SaveResult saveResult) {}

  /**
   * Returns the status of an asynchronous insert or update operation that’s identified by a Database.SaveResult object.
   * @param asyncLocator 
   * @return Database.SaveResult
   */
  global static Database.SaveResult getAsyncSaveResult(String asyncLocator) {}

  global static Database.Cursor getCursor(String query) {}

  global static Database.Cursor getCursor(String query, Object accessLevel) {}

  global static Database.Cursor getCursorWithBinds(String query, Map bindMap, Object accessLevel) {}

  /**
   * Returns the list of individual records that have been deleted for an sObject type within the specified start and end dates and times and that are still in the Recycle Bin.
   * @param sObjectType The sObjectType argument is the sObject type name for which to get the deleted records, such as account or merchandise__c.
   * @param startDate Start date and time of the deleted records time window.
   * @param endDate End date and time of the deleted records time window.
   * @return Database.GetDeletedResult
   */
  global static Database.GetDeletedResult getDeleted(String sObjectType, Datetime startDate, Datetime endDate) {}

  global static Database.PaginationCursor getPaginationCursor(String query) {}

  global static Database.PaginationCursor getPaginationCursor(String query, Object accessLevel) {}

  global static Database.PaginationCursor getPaginationCursorWithBinds(String query, Map bindMap, Object accessLevel) {}

  /**
   * Creates a QueryLocator object used in batch Apex or Visualforce.
   * @param staticSoqlQueryResult The staticSoqlQueryResult parameter must be a static, inline SOQL query.
   * @return Database.QueryLocator
   */
  global static Database.QueryLocator getQueryLocator(sObject [] staticSoqlQueryResult) {}

  /**
   * Creates a QueryLocator object used in batch Apex or Visualforce.
   * @param query 
   * @return Database.QueryLocator
   */
  global static Database.QueryLocator getQueryLocator(String query) {}

  /**
   * Creates a QueryLocator object used in batch Apex or Visualforce.
   * @param staticSoqlQueryResult The staticSoqlQueryResult parameter must be a static, inline SOQL query.
   * @param accessLevel 
   * @return Database.QueryLocator
   */
  global static Database.QueryLocator getQueryLocator(sObject [] staticSoqlQueryResult, System.AccessLevel accessLevel) {}

  /**
   * Creates a QueryLocator object used in batch Apex or Visualforce.
   * @param query 
   * @param accessLevel 
   * @return Database.QueryLocator
   */
  global static Database.QueryLocator getQueryLocator(String query, System.AccessLevel accessLevel) {}

  global static Database.QueryLocator getQueryLocatorWithBinds(String query, Map<String, Object> bindMap, System.AccessLevel accessLevel) {}

  /**
   * Returns the list of individual records that have been updated for an sObject type within the specified start and end dates and times.
   * @param sobjectType The sObjectType argument is the sObject type name for which to get the updated records, such as account or merchandise__c.
   * @param startDate The startDate argument is the start date and time of the updated records time window.
   * @param endDate The endDate argument is the end date and time of the updated records time window.
   * @return Database.GetUpdatedResult
   */
  global static Database.GetUpdatedResult getUpdated(String sobjectType, Datetime startDate, Datetime endDate) {}


  /**
   * Initiates requests to add external object data to the relevant external systems. The requests are executed asynchronously, as background operations, and are sent to the external systems that are defined by the external objects' associated external data sources. Allows referencing a callback class whose processSave method is called for each record after the remote operations are completed.
   * @param sobjects List of external object records to insert.
   * @param callback The callback object that contains the state in the originating context and an action (the processSave method) that executes after the insert operation is completed. Use the action callback to update org data according to the operation’s results. The callback object must extend DataSource.AsyncSaveCallback .
   * @return List<Database.SaveResult>
   */
  global static List<Database.SaveResult> insertAsync(List<SObject> sobjects, DataSource.AsyncSaveCallback callback) {}

  /**
   * Initiates requests to add external object data to the relevant external systems. The requests are executed asynchronously, as background operations, and are sent to the external systems that are defined by the external objects' associated external data sources. Allows referencing a callback class whose processSave method is called for each record after the remote operations are completed.
   * @param sobject 
   * @param callback The callback object that contains the state in the originating context and an action (the processSave method) that executes after the insert operation is completed. Use the action callback to update org data according to the operation’s results. The callback object must extend DataSource.AsyncSaveCallback .
   * @return Database.SaveResult
   */
  global static Database.SaveResult insertAsync(SObject sobject, DataSource.AsyncSaveCallback callback) {}

  /**
   * Initiates requests to add external object data to the relevant external systems. The requests are executed asynchronously, as background operations, and are sent to the external systems that are defined by the external objects' associated external data sources. Allows referencing a callback class whose processSave method is called for each record after the remote operations are completed.
   * @param sobjects List of external object records to insert.
   * @return List<Database.SaveResult>
   */
  global static List<Database.SaveResult> insertAsync(List<SObject> sobjects) {}

  /**
   * Initiates requests to add external object data to the relevant external systems. The requests are executed asynchronously, as background operations, and are sent to the external systems that are defined by the external objects' associated external data sources. Allows referencing a callback class whose processSave method is called for each record after the remote operations are completed.
   * @param sobject 
   * @return Database.SaveResult
   */
  global static Database.SaveResult insertAsync(SObject sobject) {}

  /**
   * Initiates requests to add external object data to the relevant external systems. The requests are executed asynchronously, as background operations, and are sent to the external systems that are defined by the external objects' associated external data sources. Allows referencing a callback class whose processSave method is called for each record after the remote operations are completed.
   * @param sobject 
   * @param callback The callback object that contains the state in the originating context and an action (the processSave method) that executes after the insert operation is completed. Use the action callback to update org data according to the operation’s results. The callback object must extend DataSource.AsyncSaveCallback .
   * @param accessLevel 
   * @return Database.SaveResult
   */
  global static Database.SaveResult insertAsync(SObject sobject, DataSource.AsyncSaveCallback callback, System.AccessLevel accessLevel) {}

  /**
   * Initiates requests to add external object data to the relevant external systems. The requests are executed asynchronously, as background operations, and are sent to the external systems that are defined by the external objects' associated external data sources. Allows referencing a callback class whose processSave method is called for each record after the remote operations are completed.
   * @param sobjects List of external object records to insert.
   * @param accessLevel 
   * @return List<Database.SaveResult>
   */
  global static List<Database.SaveResult> insertAsync(List<SObject> sobjects, System.AccessLevel accessLevel) {}

  /**
   * Initiates requests to add external object data to the relevant external systems. The requests are executed asynchronously, as background operations, and are sent to the external systems that are defined by the external objects' associated external data sources. Allows referencing a callback class whose processSave method is called for each record after the remote operations are completed.
   * @param sobject 
   * @param accessLevel 
   * @return Database.SaveResult
   */
  global static Database.SaveResult insertAsync(SObject sobject, System.AccessLevel accessLevel) {}

  /**
   * Initiates requests to add external object data to the relevant external systems. The requests are executed synchronously and are sent to the external systems that are defined by the external objects' associated external data sources. If the Apex transaction contains pending changes, the synchronous operations can't be completed and throw exceptions.
   * @param sobjects List of external object records to insert.
   * @return List<Database.SaveResult>
   */
  global static List<Database.SaveResult> insertImmediate(List<SObject> sobjects) {}

  /**
   * Initiates requests to add external object data to the relevant external systems. The requests are executed synchronously and are sent to the external systems that are defined by the external objects' associated external data sources. If the Apex transaction contains pending changes, the synchronous operations can't be completed and throw exceptions.
   * @param sobject 
   * @return Database.SaveResult
   */
  global static Database.SaveResult insertImmediate(SObject sobject) {}

  /**
   * Initiates requests to add external object data to the relevant external systems. The requests are executed synchronously and are sent to the external systems that are defined by the external objects' associated external data sources. If the Apex transaction contains pending changes, the synchronous operations can't be completed and throw exceptions.
   * @param sobjects List of external object records to insert.
   * @param accessLevel 
   * @return List<Database.SaveResult>
   */
  global static List<Database.SaveResult> insertImmediate(List<SObject> sobjects, System.AccessLevel accessLevel) {}

  /**
   * Initiates requests to add external object data to the relevant external systems. The requests are executed synchronously and are sent to the external systems that are defined by the external objects' associated external data sources. If the Apex transaction contains pending changes, the synchronous operations can't be completed and throw exceptions.
   * @param sobject 
   * @param accessLevel 
   * @return Database.SaveResult
   */
  global static Database.SaveResult insertImmediate(SObject sobject, System.AccessLevel accessLevel) {}


  /**
   * Creates a dynamic SOQL query at runtime.
   * @param queryString 
   * @return List<SObject>
   */
  global static List<SObject> query(String queryString) {}

  /**
   * Creates a dynamic SOQL query at runtime.
   * @param queryString 
   * @param accessLevel 
   * @return List<SObject>
   */
  global static List<SObject> query(String queryString, System.AccessLevel accessLevel) {}

  global static List<SObject> queryWithBinds(String queryString, Map<String, Object> bindMap, System.AccessLevel accessLevel) {}

  global static void releaseSavepoint(System.Savepoint databaseSavepoint) {}

  /**
   * Restores the database to the state specified by the savepoint variable. Any emails submitted since the last savepoint are also rolled back and not sent.
   * @param databaseSavepoint 
   */
  global static void rollback(System.Savepoint databaseSavepoint) {}

  /**
   * Returns a savepoint variable that can be stored as a local variable, then used with the rollback method to restore the database to that point.
   * @return System.Savepoint
   */
  global static System.Savepoint setSavepoint() {}


  /**
   * Initiates requests to update external object data on the relevant external systems. The requests are executed asynchronously, as background operations, and are sent to the external systems that are defined by the external objects' associated external data sources. Allows referencing a callback class whose processSave method is called for each record after the remote operations are completed.
   * @param sobjects List of external object records to modify.
   * @param callback The callback object that contains the state in the originating context and an action (the processSave method) that executes after the insert operation is completed. Use the action callback to update org data according to the operation’s results. The callback object must extend DataSource.AsyncSaveCallback .
   * @return List<Database.SaveResult>
   */
  global static List<Database.SaveResult> updateAsync(List<SObject> sobjects, DataSource.AsyncSaveCallback callback) {}

  /**
   * Initiates requests to update external object data on the relevant external systems. The requests are executed asynchronously, as background operations, and are sent to the external systems that are defined by the external objects' associated external data sources. Allows referencing a callback class whose processSave method is called for each record after the remote operations are completed.
   * @param sobject 
   * @param callback The callback object that contains the state in the originating context and an action (the processSave method) that executes after the insert operation is completed. Use the action callback to update org data according to the operation’s results. The callback object must extend DataSource.AsyncSaveCallback .
   * @return Database.SaveResult
   */
  global static Database.SaveResult updateAsync(SObject sobject, DataSource.AsyncSaveCallback callback) {}

  /**
   * Initiates requests to update external object data on the relevant external systems. The requests are executed asynchronously, as background operations, and are sent to the external systems that are defined by the external objects' associated external data sources. Allows referencing a callback class whose processSave method is called for each record after the remote operations are completed.
   * @param sobjects List of external object records to modify.
   * @return List<Database.SaveResult>
   */
  global static List<Database.SaveResult> updateAsync(List<SObject> sobjects) {}

  /**
   * Initiates requests to update external object data on the relevant external systems. The requests are executed asynchronously, as background operations, and are sent to the external systems that are defined by the external objects' associated external data sources. Allows referencing a callback class whose processSave method is called for each record after the remote operations are completed.
   * @param sobject 
   * @return Database.SaveResult
   */
  global static Database.SaveResult updateAsync(SObject sobject) {}

  /**
   * Initiates requests to update external object data on the relevant external systems. The requests are executed asynchronously, as background operations, and are sent to the external systems that are defined by the external objects' associated external data sources. Allows referencing a callback class whose processSave method is called for each record after the remote operations are completed.
   * @param sobjects List of external object records to modify.
   * @param callback The callback object that contains the state in the originating context and an action (the processSave method) that executes after the insert operation is completed. Use the action callback to update org data according to the operation’s results. The callback object must extend DataSource.AsyncSaveCallback .
   * @param accessLevel 
   * @return List<Database.SaveResult>
   */
  global static List<Database.SaveResult> updateAsync(List<SObject> sobjects, DataSource.AsyncSaveCallback callback, System.AccessLevel accessLevel) {}

  /**
   * Initiates requests to update external object data on the relevant external systems. The requests are executed asynchronously, as background operations, and are sent to the external systems that are defined by the external objects' associated external data sources. Allows referencing a callback class whose processSave method is called for each record after the remote operations are completed.
   * @param sobject 
   * @param callback The callback object that contains the state in the originating context and an action (the processSave method) that executes after the insert operation is completed. Use the action callback to update org data according to the operation’s results. The callback object must extend DataSource.AsyncSaveCallback .
   * @param accessLevel 
   * @return Database.SaveResult
   */
  global static Database.SaveResult updateAsync(SObject sobject, DataSource.AsyncSaveCallback callback, System.AccessLevel accessLevel) {}

  /**
   * Initiates requests to update external object data on the relevant external systems. The requests are executed asynchronously, as background operations, and are sent to the external systems that are defined by the external objects' associated external data sources. Allows referencing a callback class whose processSave method is called for each record after the remote operations are completed.
   * @param sobjects List of external object records to modify.
   * @param accessLevel 
   * @return List<Database.SaveResult>
   */
  global static List<Database.SaveResult> updateAsync(List<SObject> sobjects, System.AccessLevel accessLevel) {}

  /**
   * Initiates requests to update external object data on the relevant external systems. The requests are executed asynchronously, as background operations, and are sent to the external systems that are defined by the external objects' associated external data sources. Allows referencing a callback class whose processSave method is called for each record after the remote operations are completed.
   * @param sobject 
   * @param accessLevel 
   * @return Database.SaveResult
   */
  global static Database.SaveResult updateAsync(SObject sobject, System.AccessLevel accessLevel) {}

  /**
   * Initiates requests to update external object data on the relevant external systems. The requests are executed synchronously and are sent to the external systems that are defined by the external objects' associated external data sources. If the Apex transaction contains pending changes, the synchronous operations can't be completed and throw exceptions.
   * @param sobjects List of external object records to modify.
   * @return List<Database.SaveResult>
   */
  global static List<Database.SaveResult> updateImmediate(List<SObject> sobjects) {}

  /**
   * Initiates requests to update external object data on the relevant external systems. The requests are executed synchronously and are sent to the external systems that are defined by the external objects' associated external data sources. If the Apex transaction contains pending changes, the synchronous operations can't be completed and throw exceptions.
   * @param sobject 
   * @return Database.SaveResult
   */
  global static Database.SaveResult updateImmediate(SObject sobject) {}

  /**
   * Initiates requests to update external object data on the relevant external systems. The requests are executed synchronously and are sent to the external systems that are defined by the external objects' associated external data sources. If the Apex transaction contains pending changes, the synchronous operations can't be completed and throw exceptions.
   * @param sobjects List of external object records to modify.
   * @param accessLevel 
   * @return List<Database.SaveResult>
   */
  global static List<Database.SaveResult> updateImmediate(List<SObject> sobjects, System.AccessLevel accessLevel) {}

  /**
   * Initiates requests to update external object data on the relevant external systems. The requests are executed synchronously and are sent to the external systems that are defined by the external objects' associated external data sources. If the Apex transaction contains pending changes, the synchronous operations can't be completed and throw exceptions.
   * @param sobject 
   * @param accessLevel 
   * @return Database.SaveResult
   */
  global static Database.SaveResult updateImmediate(SObject sobject, System.AccessLevel accessLevel) {}

  global static Database.LeadConvertResult convertLead(Database.LeadConvert leadConvert) {}


  global static List<Database.NestedSaveResult> treeSave(List<SObject> sobjects) {}


  global Object clone() {}

}