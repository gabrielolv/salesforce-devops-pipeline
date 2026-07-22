"use strict";
/**
 * This file is generated from WSDL file by wsdl2schema.ts.
 * Do not modify directly.
 * To generate the file, run "ts-node path/to/wsdl2schema.ts path/to/wsdl.xml path/to/schema.ts"
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiSchemas = void 0;
exports.ApiSchemas = {
    sObject: {
        type: 'sObject',
        props: {
            type: 'string',
            fieldsToNull: ['?', 'string'],
            Id: '?string',
        },
    },
    address: {
        type: 'address',
        props: {
            city: '?string',
            country: '?string',
            countryCode: '?string',
            geocodeAccuracy: '?string',
            postalCode: '?string',
            state: '?string',
            stateCode: '?string',
            street: '?string',
        },
        extends: 'location',
    },
    location: {
        type: 'location',
        props: {
            latitude: '?number',
            longitude: '?number',
        },
    },
    QueryResult: {
        type: 'QueryResult',
        props: {
            done: 'boolean',
            queryLocator: '?string',
            records: ['?', 'sObject'],
            size: 'number',
        },
    },
    SearchResult: {
        type: 'SearchResult',
        props: {
            queryId: 'string',
            searchRecords: ['SearchRecord'],
            searchResultsMetadata: '?SearchResultsMetadata',
        },
    },
    SearchRecord: {
        type: 'SearchRecord',
        props: {
            record: 'sObject',
            searchRecordMetadata: '?SearchRecordMetadata',
            snippet: '?SearchSnippet',
        },
    },
    SearchRecordMetadata: {
        type: 'SearchRecordMetadata',
        props: {
            searchPromoted: 'boolean',
            spellCorrected: 'boolean',
        },
    },
    SearchSnippet: {
        type: 'SearchSnippet',
        props: {
            text: '?string',
            wholeFields: ['NameValuePair'],
        },
    },
    SearchResultsMetadata: {
        type: 'SearchResultsMetadata',
        props: {
            entityLabelMetadata: ['LabelsSearchMetadata'],
            entityMetadata: ['EntitySearchMetadata'],
        },
    },
    LabelsSearchMetadata: {
        type: 'LabelsSearchMetadata',
        props: {
            entityFieldLabels: ['NameValuePair'],
            entityName: 'string',
        },
    },
    EntitySearchMetadata: {
        type: 'EntitySearchMetadata',
        props: {
            entityName: 'string',
            errorMetadata: '?EntityErrorMetadata',
            fieldMetadata: ['FieldLevelSearchMetadata'],
            intentQueryMetadata: '?EntityIntentQueryMetadata',
            searchPromotionMetadata: '?EntitySearchPromotionMetadata',
            spellCorrectionMetadata: '?EntitySpellCorrectionMetadata',
        },
    },
    FieldLevelSearchMetadata: {
        type: 'FieldLevelSearchMetadata',
        props: {
            label: '?string',
            name: 'string',
            type: '?string',
        },
    },
    EntitySpellCorrectionMetadata: {
        type: 'EntitySpellCorrectionMetadata',
        props: {
            correctedQuery: 'string',
            hasNonCorrectedResults: 'boolean',
        },
    },
    EntitySearchPromotionMetadata: {
        type: 'EntitySearchPromotionMetadata',
        props: {
            promotedResultCount: 'number',
        },
    },
    EntityIntentQueryMetadata: {
        type: 'EntityIntentQueryMetadata',
        props: {
            intentQuery: 'boolean',
            message: '?string',
        },
    },
    EntityErrorMetadata: {
        type: 'EntityErrorMetadata',
        props: {
            errorCode: '?string',
            message: '?string',
        },
    },
    RelationshipReferenceTo: {
        type: 'RelationshipReferenceTo',
        props: {
            referenceTo: ['string'],
        },
    },
    RecordTypesSupported: {
        type: 'RecordTypesSupported',
        props: {
            recordTypeInfos: ['RecordTypeInfo'],
        },
    },
    JunctionIdListNames: {
        type: 'JunctionIdListNames',
        props: {
            names: ['string'],
        },
    },
    SearchLayoutButtonsDisplayed: {
        type: 'SearchLayoutButtonsDisplayed',
        props: {
            applicable: 'boolean',
            buttons: ['SearchLayoutButton'],
        },
    },
    SearchLayoutButton: {
        type: 'SearchLayoutButton',
        props: {
            apiName: 'string',
            label: 'string',
        },
    },
    SearchLayoutFieldsDisplayed: {
        type: 'SearchLayoutFieldsDisplayed',
        props: {
            applicable: 'boolean',
            fields: ['SearchLayoutField'],
        },
    },
    SearchLayoutField: {
        type: 'SearchLayoutField',
        props: {
            apiName: 'string',
            label: 'string',
            sortable: 'boolean',
        },
    },
    NameValuePair: {
        type: 'NameValuePair',
        props: {
            name: 'string',
            value: 'string',
        },
    },
    NameObjectValuePair: {
        type: 'NameObjectValuePair',
        props: {
            isVisible: '?boolean',
            name: 'string',
            value: ['any'],
        },
    },
    GetUpdatedResult: {
        type: 'GetUpdatedResult',
        props: {
            ids: ['string'],
            latestDateCovered: 'string',
        },
    },
    GetDeletedResult: {
        type: 'GetDeletedResult',
        props: {
            deletedRecords: ['DeletedRecord'],
            earliestDateAvailable: 'string',
            latestDateCovered: 'string',
        },
    },
    DeletedRecord: {
        type: 'DeletedRecord',
        props: {
            deletedDate: 'string',
            id: 'string',
        },
    },
    GetServerTimestampResult: {
        type: 'GetServerTimestampResult',
        props: {
            timestamp: 'string',
        },
    },
    InvalidateSessionsResult: {
        type: 'InvalidateSessionsResult',
        props: {
            errors: ['Error'],
            success: 'boolean',
        },
    },
    SetPasswordResult: {
        type: 'SetPasswordResult',
        props: {},
    },
    ChangeOwnPasswordResult: {
        type: 'ChangeOwnPasswordResult',
        props: {},
    },
    ResetPasswordResult: {
        type: 'ResetPasswordResult',
        props: {
            password: 'string',
        },
    },
    GetUserInfoResult: {
        type: 'GetUserInfoResult',
        props: {
            accessibilityMode: 'boolean',
            chatterExternal: 'boolean',
            currencySymbol: '?string',
            orgAttachmentFileSizeLimit: 'number',
            orgDefaultCurrencyIsoCode: '?string',
            orgDefaultCurrencyLocale: '?string',
            orgDisallowHtmlAttachments: 'boolean',
            orgHasPersonAccounts: 'boolean',
            organizationId: 'string',
            organizationMultiCurrency: 'boolean',
            organizationName: 'string',
            profileId: 'string',
            roleId: '?string',
            sessionSecondsValid: 'number',
            userDefaultCurrencyIsoCode: '?string',
            userEmail: 'string',
            userFullName: 'string',
            userId: 'string',
            userLanguage: 'string',
            userLocale: 'string',
            userName: 'string',
            userTimeZone: 'string',
            userType: 'string',
            userUiSkin: 'string',
        },
    },
    LoginResult: {
        type: 'LoginResult',
        props: {
            metadataServerUrl: '?string',
            passwordExpired: 'boolean',
            sandbox: 'boolean',
            serverUrl: '?string',
            sessionId: '?string',
            userId: '?string',
            userInfo: '?GetUserInfoResult',
        },
    },
    ExtendedErrorDetails: {
        type: 'ExtendedErrorDetails',
        props: {
            extendedErrorCode: 'string',
        },
    },
    Error: {
        type: 'Error',
        props: {
            extendedErrorDetails: ['?', 'ExtendedErrorDetails'],
            fields: ['?', 'string'],
            message: 'string',
            statusCode: 'string',
        },
    },
    SendEmailError: {
        type: 'SendEmailError',
        props: {
            fields: ['?', 'string'],
            message: 'string',
            statusCode: 'string',
            targetObjectId: '?string',
        },
    },
    SaveResult: {
        type: 'SaveResult',
        props: {
            errors: ['Error'],
            id: '?string',
            success: 'boolean',
        },
    },
    RenderEmailTemplateError: {
        type: 'RenderEmailTemplateError',
        props: {
            fieldName: 'string',
            message: 'string',
            offset: 'number',
            statusCode: 'string',
        },
    },
    UpsertResult: {
        type: 'UpsertResult',
        props: {
            created: 'boolean',
            errors: ['Error'],
            id: '?string',
            success: 'boolean',
        },
    },
    PerformQuickActionResult: {
        type: 'PerformQuickActionResult',
        props: {
            contextId: '?string',
            created: 'boolean',
            errors: ['Error'],
            feedItemIds: ['?', 'string'],
            ids: ['?', 'string'],
            success: 'boolean',
            successMessage: '?string',
        },
    },
    QuickActionTemplateResult: {
        type: 'QuickActionTemplateResult',
        props: {
            contextId: '?string',
            defaultValueFormulas: '?sObject',
            defaultValues: '?sObject',
            errors: ['Error'],
            success: 'boolean',
        },
    },
    MergeRequest: {
        type: 'MergeRequest',
        props: {
            additionalInformationMap: ['AdditionalInformationMap'],
            masterRecord: 'sObject',
            recordToMergeIds: ['string'],
        },
    },
    MergeResult: {
        type: 'MergeResult',
        props: {
            errors: ['Error'],
            id: '?string',
            mergedRecordIds: ['string'],
            success: 'boolean',
            updatedRelatedIds: ['string'],
        },
    },
    ProcessRequest: {
        type: 'ProcessRequest',
        props: {
            comments: '?string',
            nextApproverIds: ['?', 'string'],
        },
    },
    ProcessSubmitRequest: {
        type: 'ProcessSubmitRequest',
        props: {
            objectId: 'string',
            submitterId: '?string',
            processDefinitionNameOrId: '?string',
            skipEntryCriteria: '?boolean',
        },
        extends: 'ProcessRequest',
    },
    ProcessWorkitemRequest: {
        type: 'ProcessWorkitemRequest',
        props: {
            action: 'string',
            workitemId: 'string',
        },
        extends: 'ProcessRequest',
    },
    PerformQuickActionRequest: {
        type: 'PerformQuickActionRequest',
        props: {
            contextId: '?string',
            quickActionName: 'string',
            records: ['?', 'sObject'],
        },
    },
    DescribeAvailableQuickActionResult: {
        type: 'DescribeAvailableQuickActionResult',
        props: {
            actionEnumOrId: 'string',
            label: 'string',
            name: 'string',
            type: 'string',
        },
    },
    DescribeQuickActionResult: {
        type: 'DescribeQuickActionResult',
        props: {
            accessLevelRequired: '?string',
            actionEnumOrId: 'string',
            canvasApplicationId: '?string',
            canvasApplicationName: '?string',
            colors: ['DescribeColor'],
            contextSobjectType: '?string',
            defaultValues: ['?', 'DescribeQuickActionDefaultValue'],
            flowDevName: '?string',
            flowRecordIdVar: '?string',
            height: '?number',
            iconName: '?string',
            iconUrl: '?string',
            icons: ['DescribeIcon'],
            label: 'string',
            layout: '?DescribeLayoutSection',
            lightningComponentBundleId: '?string',
            lightningComponentBundleName: '?string',
            lightningComponentQualifiedName: '?string',
            miniIconUrl: '?string',
            mobileExtensionDisplayMode: '?string',
            mobileExtensionId: '?string',
            name: 'string',
            showQuickActionLcHeader: 'boolean',
            showQuickActionVfHeader: 'boolean',
            targetParentField: '?string',
            targetRecordTypeId: '?string',
            targetSobjectType: '?string',
            type: 'string',
            visualforcePageName: '?string',
            visualforcePageUrl: '?string',
            width: '?number',
        },
    },
    DescribeQuickActionDefaultValue: {
        type: 'DescribeQuickActionDefaultValue',
        props: {
            defaultValue: '?string',
            field: 'string',
        },
    },
    DescribeVisualForceResult: {
        type: 'DescribeVisualForceResult',
        props: {
            domain: 'string',
        },
    },
    ProcessResult: {
        type: 'ProcessResult',
        props: {
            actorIds: ['string'],
            entityId: '?string',
            errors: ['Error'],
            instanceId: '?string',
            instanceStatus: '?string',
            newWorkitemIds: ['?', 'string'],
            success: 'boolean',
        },
    },
    DeleteResult: {
        type: 'DeleteResult',
        props: {
            errors: ['?', 'Error'],
            id: '?string',
            success: 'boolean',
        },
    },
    UndeleteResult: {
        type: 'UndeleteResult',
        props: {
            errors: ['Error'],
            id: '?string',
            success: 'boolean',
        },
    },
    DeleteByExampleResult: {
        type: 'DeleteByExampleResult',
        props: {
            entity: '?sObject',
            errors: ['?', 'Error'],
            rowCount: 'number',
            success: 'boolean',
        },
    },
    EmptyRecycleBinResult: {
        type: 'EmptyRecycleBinResult',
        props: {
            errors: ['Error'],
            id: '?string',
            success: 'boolean',
        },
    },
    LeadConvert: {
        type: 'LeadConvert',
        props: {
            accountId: '?string',
            accountRecord: '?sObject',
            bypassAccountDedupeCheck: '?boolean',
            bypassContactDedupeCheck: '?boolean',
            contactId: '?string',
            contactRecord: '?sObject',
            convertedStatus: 'string',
            doNotCreateOpportunity: 'boolean',
            leadId: 'string',
            opportunityId: '?string',
            opportunityName: '?string',
            opportunityRecord: '?sObject',
            overwriteLeadSource: 'boolean',
            ownerId: '?string',
            sendNotificationEmail: 'boolean',
        },
    },
    LeadConvertResult: {
        type: 'LeadConvertResult',
        props: {
            accountId: '?string',
            contactId: '?string',
            errors: ['Error'],
            leadId: '?string',
            opportunityId: '?string',
            success: 'boolean',
        },
    },
    DescribeSObjectResult: {
        type: 'DescribeSObjectResult',
        props: {
            actionOverrides: ['?', 'ActionOverride'],
            activateable: 'boolean',
            childRelationships: ['ChildRelationship'],
            compactLayoutable: 'boolean',
            createable: 'boolean',
            custom: 'boolean',
            customSetting: 'boolean',
            dataTranslationEnabled: '?boolean',
            deepCloneable: 'boolean',
            defaultImplementation: '?string',
            deletable: 'boolean',
            deprecatedAndHidden: 'boolean',
            feedEnabled: 'boolean',
            fields: ['?', 'Field'],
            hasSubtypes: 'boolean',
            idEnabled: 'boolean',
            implementedBy: '?string',
            implementsInterfaces: '?string',
            isInterface: 'boolean',
            isSubtype: 'boolean',
            keyPrefix: '?string',
            label: 'string',
            labelPlural: 'string',
            layoutable: 'boolean',
            mergeable: 'boolean',
            mruEnabled: 'boolean',
            name: 'string',
            namedLayoutInfos: ['NamedLayoutInfo'],
            networkScopeFieldName: '?string',
            queryable: 'boolean',
            recordTypeInfos: ['RecordTypeInfo'],
            replicateable: 'boolean',
            retrieveable: 'boolean',
            searchLayoutable: '?boolean',
            searchable: 'boolean',
            supportedScopes: ['?', 'ScopeInfo'],
            triggerable: '?boolean',
            undeletable: 'boolean',
            updateable: 'boolean',
            urlDetail: '?string',
            urlEdit: '?string',
            urlNew: '?string',
        },
    },
    DescribeGlobalSObjectResult: {
        type: 'DescribeGlobalSObjectResult',
        props: {
            activateable: 'boolean',
            createable: 'boolean',
            custom: 'boolean',
            customSetting: 'boolean',
            dataTranslationEnabled: '?boolean',
            deepCloneable: 'boolean',
            deletable: 'boolean',
            deprecatedAndHidden: 'boolean',
            feedEnabled: 'boolean',
            hasSubtypes: 'boolean',
            idEnabled: 'boolean',
            isInterface: 'boolean',
            isSubtype: 'boolean',
            keyPrefix: '?string',
            label: 'string',
            labelPlural: 'string',
            layoutable: 'boolean',
            mergeable: 'boolean',
            mruEnabled: 'boolean',
            name: 'string',
            queryable: 'boolean',
            replicateable: 'boolean',
            retrieveable: 'boolean',
            searchable: 'boolean',
            triggerable: 'boolean',
            undeletable: 'boolean',
            updateable: 'boolean',
        },
    },
    ChildRelationship: {
        type: 'ChildRelationship',
        props: {
            cascadeDelete: 'boolean',
            childSObject: 'string',
            deprecatedAndHidden: 'boolean',
            field: 'string',
            junctionIdListNames: ['?', 'string'],
            junctionReferenceTo: ['?', 'string'],
            relationshipName: '?string',
            restrictedDelete: '?boolean',
        },
    },
    DescribeGlobalResult: {
        type: 'DescribeGlobalResult',
        props: {
            encoding: '?string',
            maxBatchSize: 'number',
            sobjects: ['DescribeGlobalSObjectResult'],
        },
    },
    DescribeGlobalTheme: {
        type: 'DescribeGlobalTheme',
        props: {
            global: 'DescribeGlobalResult',
            theme: 'DescribeThemeResult',
        },
    },
    ScopeInfo: {
        type: 'ScopeInfo',
        props: {
            label: 'string',
            name: 'string',
        },
    },
    StringList: {
        type: 'StringList',
        props: {
            values: ['string'],
        },
    },
    ChangeEventHeader: {
        type: 'ChangeEventHeader',
        props: {
            entityName: 'string',
            recordIds: ['string'],
            commitTimestamp: 'number',
            commitNumber: 'number',
            commitUser: 'string',
            diffFields: ['string'],
            changeType: 'string',
            changeOrigin: 'string',
            transactionKey: 'string',
            sequenceNumber: 'number',
            nulledFields: ['string'],
            changedFields: ['string'],
        },
    },
    FilteredLookupInfo: {
        type: 'FilteredLookupInfo',
        props: {
            controllingFields: ['string'],
            dependent: 'boolean',
            optionalFilter: 'boolean',
        },
    },
    Field: {
        type: 'Field',
        props: {
            aggregatable: 'boolean',
            aiPredictionField: 'boolean',
            autoNumber: 'boolean',
            byteLength: 'number',
            calculated: 'boolean',
            calculatedFormula: '?string',
            cascadeDelete: '?boolean',
            caseSensitive: 'boolean',
            compoundFieldName: '?string',
            controllerName: '?string',
            createable: 'boolean',
            custom: 'boolean',
            dataTranslationEnabled: '?boolean',
            defaultValue: '?any',
            defaultValueFormula: '?string',
            defaultedOnCreate: 'boolean',
            dependentPicklist: '?boolean',
            deprecatedAndHidden: 'boolean',
            digits: 'number',
            displayLocationInDecimal: '?boolean',
            encrypted: '?boolean',
            externalId: '?boolean',
            extraTypeInfo: '?string',
            filterable: 'boolean',
            filteredLookupInfo: '?FilteredLookupInfo',
            formulaTreatNullNumberAsZero: '?boolean',
            groupable: 'boolean',
            highScaleNumber: '?boolean',
            htmlFormatted: '?boolean',
            idLookup: 'boolean',
            inlineHelpText: '?string',
            label: 'string',
            length: 'number',
            mask: '?string',
            maskType: '?string',
            name: 'string',
            nameField: 'boolean',
            namePointing: '?boolean',
            nillable: 'boolean',
            permissionable: 'boolean',
            picklistValues: ['?', 'PicklistEntry'],
            polymorphicForeignKey: 'boolean',
            precision: 'number',
            queryByDistance: 'boolean',
            referenceTargetField: '?string',
            referenceTo: ['?', 'string'],
            relationshipName: '?string',
            relationshipOrder: '?number',
            restrictedDelete: '?boolean',
            restrictedPicklist: 'boolean',
            scale: 'number',
            searchPrefilterable: 'boolean',
            soapType: 'string',
            sortable: '?boolean',
            type: 'string',
            unique: 'boolean',
            updateable: 'boolean',
            writeRequiresMasterRead: '?boolean',
        },
    },
    PicklistEntry: {
        type: 'PicklistEntry',
        props: {
            active: 'boolean',
            defaultValue: 'boolean',
            label: '?string',
            validFor: '?string',
            value: 'string',
        },
    },
    DescribeDataCategoryGroupResult: {
        type: 'DescribeDataCategoryGroupResult',
        props: {
            categoryCount: 'number',
            description: 'string',
            label: 'string',
            name: 'string',
            sobject: 'string',
        },
    },
    DescribeDataCategoryGroupStructureResult: {
        type: 'DescribeDataCategoryGroupStructureResult',
        props: {
            description: 'string',
            label: 'string',
            name: 'string',
            sobject: 'string',
            topCategories: ['DataCategory'],
        },
    },
    DataCategoryGroupSobjectTypePair: {
        type: 'DataCategoryGroupSobjectTypePair',
        props: {
            dataCategoryGroupName: 'string',
            sobject: 'string',
        },
    },
    DataCategory: {
        type: 'DataCategory',
        props: {
            childCategories: ['DataCategory'],
            label: 'string',
            name: 'string',
        },
    },
    DescribeDataCategoryMappingResult: {
        type: 'DescribeDataCategoryMappingResult',
        props: {
            dataCategoryGroupId: 'string',
            dataCategoryGroupLabel: 'string',
            dataCategoryGroupName: 'string',
            dataCategoryId: 'string',
            dataCategoryLabel: 'string',
            dataCategoryName: 'string',
            id: 'string',
            mappedEntity: 'string',
            mappedField: 'string',
        },
    },
    KnowledgeSettings: {
        type: 'KnowledgeSettings',
        props: {
            defaultLanguage: '?string',
            knowledgeEnabled: 'boolean',
            languages: ['KnowledgeLanguageItem'],
        },
    },
    KnowledgeLanguageItem: {
        type: 'KnowledgeLanguageItem',
        props: {
            active: 'boolean',
            assigneeId: '?string',
            name: 'string',
        },
    },
    FieldDiff: {
        type: 'FieldDiff',
        props: {
            difference: 'string',
            name: 'string',
        },
    },
    AdditionalInformationMap: {
        type: 'AdditionalInformationMap',
        props: {
            name: 'string',
            value: 'string',
        },
    },
    MatchRecord: {
        type: 'MatchRecord',
        props: {
            additionalInformation: ['AdditionalInformationMap'],
            fieldDiffs: ['FieldDiff'],
            matchConfidence: 'number',
            record: 'sObject',
        },
    },
    MatchResult: {
        type: 'MatchResult',
        props: {
            entityType: 'string',
            errors: ['Error'],
            matchEngine: 'string',
            matchRecords: ['MatchRecord'],
            rule: 'string',
            size: 'number',
            success: 'boolean',
        },
    },
    DuplicateResult: {
        type: 'DuplicateResult',
        props: {
            allowSave: 'boolean',
            duplicateRule: 'string',
            duplicateRuleEntityType: 'string',
            errorMessage: '?string',
            matchResults: ['MatchResult'],
        },
    },
    DuplicateError: {
        type: 'DuplicateError',
        props: {
            duplicateResult: 'DuplicateResult',
        },
        extends: 'Error',
    },
    DescribeNounResult: {
        type: 'DescribeNounResult',
        props: {
            caseValues: ['NameCaseValue'],
            developerName: 'string',
            gender: '?string',
            name: 'string',
            pluralAlias: '?string',
            startsWith: '?string',
        },
    },
    NameCaseValue: {
        type: 'NameCaseValue',
        props: {
            article: '?string',
            caseType: '?string',
            number: '?string',
            possessive: '?string',
            value: '?string',
        },
    },
    FindDuplicatesResult: {
        type: 'FindDuplicatesResult',
        props: {
            duplicateResults: ['DuplicateResult'],
            errors: ['Error'],
            success: 'boolean',
        },
    },
    DescribeAppMenuResult: {
        type: 'DescribeAppMenuResult',
        props: {
            appMenuItems: ['DescribeAppMenuItem'],
        },
    },
    DescribeAppMenuItem: {
        type: 'DescribeAppMenuItem',
        props: {
            colors: ['DescribeColor'],
            content: 'string',
            icons: ['DescribeIcon'],
            label: 'string',
            name: 'string',
            type: 'string',
            url: 'string',
        },
    },
    DescribeThemeResult: {
        type: 'DescribeThemeResult',
        props: {
            themeItems: ['DescribeThemeItem'],
        },
    },
    DescribeThemeItem: {
        type: 'DescribeThemeItem',
        props: {
            colors: ['DescribeColor'],
            icons: ['DescribeIcon'],
            name: 'string',
        },
    },
    DescribeSoftphoneLayoutResult: {
        type: 'DescribeSoftphoneLayoutResult',
        props: {
            callTypes: ['DescribeSoftphoneLayoutCallType'],
            id: 'string',
            name: 'string',
        },
    },
    DescribeSoftphoneLayoutCallType: {
        type: 'DescribeSoftphoneLayoutCallType',
        props: {
            infoFields: ['DescribeSoftphoneLayoutInfoField'],
            name: 'string',
            screenPopOptions: ['DescribeSoftphoneScreenPopOption'],
            screenPopsOpenWithin: '?string',
            sections: ['DescribeSoftphoneLayoutSection'],
        },
    },
    DescribeSoftphoneScreenPopOption: {
        type: 'DescribeSoftphoneScreenPopOption',
        props: {
            matchType: 'string',
            screenPopData: 'string',
            screenPopType: 'string',
        },
    },
    DescribeSoftphoneLayoutInfoField: {
        type: 'DescribeSoftphoneLayoutInfoField',
        props: {
            name: 'string',
        },
    },
    DescribeSoftphoneLayoutSection: {
        type: 'DescribeSoftphoneLayoutSection',
        props: {
            entityApiName: 'string',
            items: ['DescribeSoftphoneLayoutItem'],
        },
    },
    DescribeSoftphoneLayoutItem: {
        type: 'DescribeSoftphoneLayoutItem',
        props: {
            itemApiName: 'string',
        },
    },
    DescribeCompactLayoutsResult: {
        type: 'DescribeCompactLayoutsResult',
        props: {
            compactLayouts: ['DescribeCompactLayout'],
            defaultCompactLayoutId: 'string',
            recordTypeCompactLayoutMappings: ['RecordTypeCompactLayoutMapping'],
        },
    },
    DescribeCompactLayout: {
        type: 'DescribeCompactLayout',
        props: {
            actions: ['DescribeLayoutButton'],
            fieldItems: ['DescribeLayoutItem'],
            id: 'string',
            imageItems: ['DescribeLayoutItem'],
            label: 'string',
            name: 'string',
            objectType: 'string',
        },
    },
    RecordTypeCompactLayoutMapping: {
        type: 'RecordTypeCompactLayoutMapping',
        props: {
            available: 'boolean',
            compactLayoutId: '?string',
            compactLayoutName: 'string',
            recordTypeId: 'string',
            recordTypeName: 'string',
        },
    },
    DescribePathAssistantsResult: {
        type: 'DescribePathAssistantsResult',
        props: {
            pathAssistants: ['DescribePathAssistant'],
        },
    },
    DescribePathAssistant: {
        type: 'DescribePathAssistant',
        props: {
            active: 'boolean',
            animationRule: ['?', 'DescribeAnimationRule'],
            apiName: 'string',
            label: 'string',
            pathPicklistField: 'string',
            picklistsForRecordType: ['?', 'PicklistForRecordType'],
            recordTypeId: '?string',
            steps: ['DescribePathAssistantStep'],
        },
    },
    DescribePathAssistantStep: {
        type: 'DescribePathAssistantStep',
        props: {
            closed: 'boolean',
            converted: 'boolean',
            fields: ['DescribePathAssistantField'],
            info: '?string',
            layoutSection: '?DescribeLayoutSection',
            picklistLabel: 'string',
            picklistValue: 'string',
            won: 'boolean',
        },
    },
    DescribePathAssistantField: {
        type: 'DescribePathAssistantField',
        props: {
            apiName: 'string',
            label: 'string',
            readOnly: 'boolean',
            required: 'boolean',
        },
    },
    DescribeAnimationRule: {
        type: 'DescribeAnimationRule',
        props: {
            animationFrequency: 'string',
            isActive: 'boolean',
            recordTypeContext: 'string',
            recordTypeId: '?string',
            targetField: 'string',
            targetFieldChangeToValues: 'string',
        },
    },
    DescribeApprovalLayoutResult: {
        type: 'DescribeApprovalLayoutResult',
        props: {
            approvalLayouts: ['DescribeApprovalLayout'],
        },
    },
    DescribeApprovalLayout: {
        type: 'DescribeApprovalLayout',
        props: {
            id: 'string',
            label: 'string',
            layoutItems: ['DescribeLayoutItem'],
            name: 'string',
        },
    },
    DescribeLayoutResult: {
        type: 'DescribeLayoutResult',
        props: {
            layouts: ['DescribeLayout'],
            recordTypeMappings: ['RecordTypeMapping'],
            recordTypeSelectorRequired: 'boolean',
        },
    },
    DescribeLayout: {
        type: 'DescribeLayout',
        props: {
            buttonLayoutSection: '?DescribeLayoutButtonSection',
            detailLayoutSections: ['DescribeLayoutSection'],
            editLayoutSections: ['DescribeLayoutSection'],
            feedView: '?DescribeLayoutFeedView',
            highlightsPanelLayoutSection: '?DescribeLayoutSection',
            id: '?string',
            quickActionList: '?DescribeQuickActionListResult',
            relatedContent: '?RelatedContent',
            relatedLists: ['RelatedList'],
            saveOptions: ['DescribeLayoutSaveOption'],
        },
    },
    DescribeQuickActionListResult: {
        type: 'DescribeQuickActionListResult',
        props: {
            quickActionListItems: ['DescribeQuickActionListItemResult'],
        },
    },
    DescribeQuickActionListItemResult: {
        type: 'DescribeQuickActionListItemResult',
        props: {
            accessLevelRequired: '?string',
            colors: ['DescribeColor'],
            iconUrl: '?string',
            icons: ['DescribeIcon'],
            label: 'string',
            miniIconUrl: 'string',
            quickActionName: 'string',
            targetSobjectType: '?string',
            type: 'string',
        },
    },
    DescribeLayoutFeedView: {
        type: 'DescribeLayoutFeedView',
        props: {
            feedFilters: ['DescribeLayoutFeedFilter'],
        },
    },
    DescribeLayoutFeedFilter: {
        type: 'DescribeLayoutFeedFilter',
        props: {
            label: 'string',
            name: 'string',
            type: 'string',
        },
    },
    DescribeLayoutSaveOption: {
        type: 'DescribeLayoutSaveOption',
        props: {
            defaultValue: 'boolean',
            isDisplayed: 'boolean',
            label: 'string',
            name: 'string',
            restHeaderName: 'string',
            soapHeaderName: 'string',
        },
    },
    DescribeLayoutSection: {
        type: 'DescribeLayoutSection',
        props: {
            collapsed: 'boolean',
            columns: 'number',
            heading: '?string',
            layoutRows: ['DescribeLayoutRow'],
            layoutSectionId: '?string',
            parentLayoutId: 'string',
            rows: 'number',
            tabOrder: 'string',
            useCollapsibleSection: 'boolean',
            useHeading: 'boolean',
        },
    },
    DescribeLayoutButtonSection: {
        type: 'DescribeLayoutButtonSection',
        props: {
            detailButtons: ['DescribeLayoutButton'],
        },
    },
    DescribeLayoutRow: {
        type: 'DescribeLayoutRow',
        props: {
            layoutItems: ['DescribeLayoutItem'],
            numItems: 'number',
        },
    },
    DescribeLayoutItem: {
        type: 'DescribeLayoutItem',
        props: {
            editableForNew: 'boolean',
            editableForUpdate: 'boolean',
            label: '?string',
            layoutComponents: ['DescribeLayoutComponent'],
            placeholder: 'boolean',
            required: 'boolean',
        },
    },
    DescribeLayoutButton: {
        type: 'DescribeLayoutButton',
        props: {
            behavior: '?string',
            colors: ['DescribeColor'],
            content: '?string',
            contentSource: '?string',
            custom: 'boolean',
            encoding: '?string',
            height: '?number',
            icons: ['DescribeIcon'],
            label: '?string',
            menubar: '?boolean',
            name: '?string',
            overridden: 'boolean',
            resizeable: '?boolean',
            scrollbars: '?boolean',
            showsLocation: '?boolean',
            showsStatus: '?boolean',
            toolbar: '?boolean',
            url: '?string',
            width: '?number',
            windowPosition: '?string',
        },
    },
    DescribeLayoutComponent: {
        type: 'DescribeLayoutComponent',
        props: {
            displayLines: 'number',
            tabOrder: 'number',
            type: 'string',
            value: '?string',
        },
    },
    FieldComponent: {
        type: 'FieldComponent',
        props: {
            field: 'Field',
        },
        extends: 'DescribeLayoutComponent',
    },
    FieldLayoutComponent: {
        type: 'FieldLayoutComponent',
        props: {
            components: ['DescribeLayoutComponent'],
            fieldType: 'string',
        },
        extends: 'DescribeLayoutComponent',
    },
    VisualforcePage: {
        type: 'VisualforcePage',
        props: {
            showLabel: 'boolean',
            showScrollbars: 'boolean',
            suggestedHeight: 'string',
            suggestedWidth: 'string',
            url: 'string',
        },
        extends: 'DescribeLayoutComponent',
    },
    Canvas: {
        type: 'Canvas',
        props: {
            displayLocation: 'string',
            referenceId: 'string',
            showLabel: 'boolean',
            showScrollbars: 'boolean',
            suggestedHeight: 'string',
            suggestedWidth: 'string',
        },
        extends: 'DescribeLayoutComponent',
    },
    ReportChartComponent: {
        type: 'ReportChartComponent',
        props: {
            cacheData: 'boolean',
            contextFilterableField: 'string',
            error: 'string',
            hideOnError: 'boolean',
            includeContext: 'boolean',
            showTitle: 'boolean',
            size: 'string',
        },
        extends: 'DescribeLayoutComponent',
    },
    AnalyticsCloudComponent: {
        type: 'AnalyticsCloudComponent',
        props: {
            error: 'string',
            filter: 'string',
            height: 'string',
            hideOnError: 'boolean',
            showSharing: 'boolean',
            showTitle: 'boolean',
            width: 'string',
        },
        extends: 'DescribeLayoutComponent',
    },
    CustomLinkComponent: {
        type: 'CustomLinkComponent',
        props: {
            customLink: 'DescribeLayoutButton',
        },
        extends: 'DescribeLayoutComponent',
    },
    NamedLayoutInfo: {
        type: 'NamedLayoutInfo',
        props: {
            name: 'string',
        },
    },
    RecordTypeInfo: {
        type: 'RecordTypeInfo',
        props: {
            active: 'boolean',
            available: 'boolean',
            defaultRecordTypeMapping: 'boolean',
            developerName: 'string',
            master: 'boolean',
            name: 'string',
            recordTypeId: '?string',
        },
    },
    RecordTypeMapping: {
        type: 'RecordTypeMapping',
        props: {
            active: 'boolean',
            available: 'boolean',
            defaultRecordTypeMapping: 'boolean',
            developerName: 'string',
            layoutId: 'string',
            master: 'boolean',
            name: 'string',
            picklistsForRecordType: ['?', 'PicklistForRecordType'],
            recordTypeId: '?string',
        },
    },
    PicklistForRecordType: {
        type: 'PicklistForRecordType',
        props: {
            picklistName: 'string',
            picklistValues: ['?', 'PicklistEntry'],
        },
    },
    RelatedContent: {
        type: 'RelatedContent',
        props: {
            relatedContentItems: ['DescribeRelatedContentItem'],
        },
    },
    DescribeRelatedContentItem: {
        type: 'DescribeRelatedContentItem',
        props: {
            describeLayoutItem: 'DescribeLayoutItem',
        },
    },
    RelatedList: {
        type: 'RelatedList',
        props: {
            accessLevelRequiredForCreate: '?string',
            buttons: ['?', 'DescribeLayoutButton'],
            columns: ['RelatedListColumn'],
            custom: 'boolean',
            field: '?string',
            label: 'string',
            limitRows: 'number',
            name: 'string',
            sobject: '?string',
            sort: ['RelatedListSort'],
        },
    },
    RelatedListColumn: {
        type: 'RelatedListColumn',
        props: {
            field: '?string',
            fieldApiName: 'string',
            format: '?string',
            label: 'string',
            lookupId: '?string',
            name: 'string',
            sortable: 'boolean',
        },
    },
    RelatedListSort: {
        type: 'RelatedListSort',
        props: {
            ascending: 'boolean',
            column: 'string',
        },
    },
    EmailFileAttachment: {
        type: 'EmailFileAttachment',
        props: {
            body: '?string',
            contentType: '?string',
            fileName: 'string',
            id: '?string',
            inline: '?boolean',
        },
    },
    Email: {
        type: 'Email',
        props: {
            bccSender: '?boolean',
            emailPriority: '?string',
            replyTo: '?string',
            saveAsActivity: '?boolean',
            senderDisplayName: '?string',
            subject: '?string',
            useSignature: '?boolean',
        },
    },
    MassEmailMessage: {
        type: 'MassEmailMessage',
        props: {
            description: '?string',
            targetObjectIds: '?string',
            templateId: 'string',
            whatIds: '?string',
        },
        extends: 'Email',
    },
    SingleEmailMessage: {
        type: 'SingleEmailMessage',
        props: {
            bccAddresses: '?string',
            ccAddresses: '?string',
            charset: '?string',
            documentAttachments: ['string'],
            entityAttachments: ['string'],
            fileAttachments: ['EmailFileAttachment'],
            htmlBody: '?string',
            inReplyTo: '?string',
            optOutPolicy: '?string',
            orgWideEmailAddressId: '?string',
            plainTextBody: '?string',
            references: '?string',
            targetObjectId: '?string',
            templateId: '?string',
            templateName: '?string',
            toAddresses: '?string',
            treatBodiesAsTemplate: '?boolean',
            treatTargetObjectAsRecipient: '?boolean',
            whatId: '?string',
        },
        extends: 'Email',
    },
    SendEmailResult: {
        type: 'SendEmailResult',
        props: {
            errors: ['SendEmailError'],
            success: 'boolean',
        },
    },
    ListViewColumn: {
        type: 'ListViewColumn',
        props: {
            ascendingLabel: '?string',
            descendingLabel: '?string',
            fieldNameOrPath: 'string',
            hidden: 'boolean',
            label: 'string',
            searchable: 'boolean',
            selectListItem: 'string',
            sortDirection: '?string',
            sortIndex: '?number',
            sortable: 'boolean',
            type: 'string',
        },
    },
    ListViewOrderBy: {
        type: 'ListViewOrderBy',
        props: {
            fieldNameOrPath: 'string',
            nullsPosition: '?string',
            sortDirection: '?string',
        },
    },
    DescribeSoqlListView: {
        type: 'DescribeSoqlListView',
        props: {
            columns: ['ListViewColumn'],
            id: 'string',
            orderBy: ['ListViewOrderBy'],
            query: 'string',
            relatedEntityId: '?string',
            scope: '?string',
            scopeEntityId: '?string',
            sobjectType: 'string',
            whereCondition: '?SoqlWhereCondition',
        },
    },
    DescribeSoqlListViewsRequest: {
        type: 'DescribeSoqlListViewsRequest',
        props: {
            listViewParams: ['DescribeSoqlListViewParams'],
        },
    },
    DescribeSoqlListViewParams: {
        type: 'DescribeSoqlListViewParams',
        props: {
            developerNameOrId: 'string',
            sobjectType: '?string',
        },
    },
    DescribeSoqlListViewResult: {
        type: 'DescribeSoqlListViewResult',
        props: {
            describeSoqlListViews: ['DescribeSoqlListView'],
        },
    },
    ExecuteListViewRequest: {
        type: 'ExecuteListViewRequest',
        props: {
            developerNameOrId: 'string',
            limit: '?number',
            offset: '?number',
            orderBy: ['ListViewOrderBy'],
            sobjectType: 'string',
        },
    },
    ExecuteListViewResult: {
        type: 'ExecuteListViewResult',
        props: {
            columns: ['ListViewColumn'],
            developerName: 'string',
            done: 'boolean',
            id: 'string',
            label: 'string',
            records: ['ListViewRecord'],
            size: 'number',
        },
    },
    ListViewRecord: {
        type: 'ListViewRecord',
        props: {
            columns: ['ListViewRecordColumn'],
        },
    },
    ListViewRecordColumn: {
        type: 'ListViewRecordColumn',
        props: {
            fieldNameOrPath: 'string',
            value: '?string',
        },
    },
    SoqlWhereCondition: {
        type: 'SoqlWhereCondition',
        props: {},
    },
    SoqlCondition: {
        type: 'SoqlCondition',
        props: {
            field: 'string',
            operator: 'string',
            values: ['string'],
        },
        extends: 'SoqlWhereCondition',
    },
    SoqlNotCondition: {
        type: 'SoqlNotCondition',
        props: {
            condition: 'SoqlWhereCondition',
        },
        extends: 'SoqlWhereCondition',
    },
    SoqlConditionGroup: {
        type: 'SoqlConditionGroup',
        props: {
            conditions: ['SoqlWhereCondition'],
            conjunction: 'string',
        },
        extends: 'SoqlWhereCondition',
    },
    SoqlSubQueryCondition: {
        type: 'SoqlSubQueryCondition',
        props: {
            field: 'string',
            operator: 'string',
            subQuery: 'string',
        },
        extends: 'SoqlWhereCondition',
    },
    DescribeSearchLayoutResult: {
        type: 'DescribeSearchLayoutResult',
        props: {
            errorMsg: '?string',
            label: '?string',
            limitRows: '?number',
            objectType: 'string',
            searchColumns: ['?', 'DescribeColumn'],
        },
    },
    DescribeColumn: {
        type: 'DescribeColumn',
        props: {
            field: 'string',
            format: '?string',
            label: 'string',
            name: 'string',
        },
    },
    DescribeSearchScopeOrderResult: {
        type: 'DescribeSearchScopeOrderResult',
        props: {
            keyPrefix: 'string',
            name: 'string',
        },
    },
    DescribeSearchableEntityResult: {
        type: 'DescribeSearchableEntityResult',
        props: {
            label: 'string',
            name: 'string',
            pluralLabel: 'string',
        },
    },
    DescribeTabSetResult: {
        type: 'DescribeTabSetResult',
        props: {
            description: 'string',
            label: 'string',
            logoUrl: 'string',
            namespace: '?string',
            selected: 'boolean',
            tabSetId: 'string',
            tabs: ['DescribeTab'],
        },
    },
    DescribeTab: {
        type: 'DescribeTab',
        props: {
            colors: ['DescribeColor'],
            custom: 'boolean',
            iconUrl: 'string',
            icons: ['DescribeIcon'],
            label: 'string',
            miniIconUrl: 'string',
            name: 'string',
            sobjectName: '?string',
            url: 'string',
        },
    },
    DescribeColor: {
        type: 'DescribeColor',
        props: {
            color: 'string',
            context: 'string',
            theme: 'string',
        },
    },
    DescribeIcon: {
        type: 'DescribeIcon',
        props: {
            contentType: 'string',
            height: '?number',
            theme: 'string',
            url: 'string',
            width: '?number',
        },
    },
    ActionOverride: {
        type: 'ActionOverride',
        props: {
            formFactor: 'string',
            isAvailableInTouch: 'boolean',
            name: 'string',
            pageId: 'string',
            url: '?string',
        },
    },
    RenderEmailTemplateRequest: {
        type: 'RenderEmailTemplateRequest',
        props: {
            escapeHtmlInMergeFields: '?boolean',
            templateBodies: 'string',
            whatId: '?string',
            whoId: '?string',
        },
    },
    RenderEmailTemplateBodyResult: {
        type: 'RenderEmailTemplateBodyResult',
        props: {
            errors: ['RenderEmailTemplateError'],
            mergedBody: '?string',
            success: 'boolean',
        },
    },
    RenderEmailTemplateResult: {
        type: 'RenderEmailTemplateResult',
        props: {
            bodyResults: '?RenderEmailTemplateBodyResult',
            errors: ['Error'],
            success: 'boolean',
        },
    },
    RenderStoredEmailTemplateRequest: {
        type: 'RenderStoredEmailTemplateRequest',
        props: {
            attachmentRetrievalOption: '?string',
            templateId: 'string',
            updateTemplateUsage: '?boolean',
            whatId: '?string',
            whoId: '?string',
        },
    },
    RenderStoredEmailTemplateResult: {
        type: 'RenderStoredEmailTemplateResult',
        props: {
            errors: ['Error'],
            renderedEmail: '?SingleEmailMessage',
            success: 'boolean',
        },
    },
    LimitInfo: {
        type: 'LimitInfo',
        props: {
            current: 'number',
            limit: 'number',
            type: 'string',
        },
    },
    OwnerChangeOption: {
        type: 'OwnerChangeOption',
        props: {
            type: 'string',
            execute: 'boolean',
        },
    },
    ApiFault: {
        type: 'ApiFault',
        props: {
            exceptionCode: 'string',
            exceptionMessage: 'string',
            extendedErrorDetails: ['?', 'ExtendedErrorDetails'],
        },
    },
    ApiQueryFault: {
        type: 'ApiQueryFault',
        props: {
            row: 'number',
            column: 'number',
        },
        extends: 'ApiFault',
    },
    LoginFault: {
        type: 'LoginFault',
        props: {},
        extends: 'ApiFault',
    },
    InvalidQueryLocatorFault: {
        type: 'InvalidQueryLocatorFault',
        props: {},
        extends: 'ApiFault',
    },
    InvalidNewPasswordFault: {
        type: 'InvalidNewPasswordFault',
        props: {},
        extends: 'ApiFault',
    },
    InvalidOldPasswordFault: {
        type: 'InvalidOldPasswordFault',
        props: {},
        extends: 'ApiFault',
    },
    InvalidIdFault: {
        type: 'InvalidIdFault',
        props: {},
        extends: 'ApiFault',
    },
    UnexpectedErrorFault: {
        type: 'UnexpectedErrorFault',
        props: {},
        extends: 'ApiFault',
    },
    InvalidFieldFault: {
        type: 'InvalidFieldFault',
        props: {},
        extends: 'ApiQueryFault',
    },
    InvalidSObjectFault: {
        type: 'InvalidSObjectFault',
        props: {},
        extends: 'ApiQueryFault',
    },
    MalformedQueryFault: {
        type: 'MalformedQueryFault',
        props: {},
        extends: 'ApiQueryFault',
    },
    MalformedSearchFault: {
        type: 'MalformedSearchFault',
        props: {},
        extends: 'ApiQueryFault',
    },
};
