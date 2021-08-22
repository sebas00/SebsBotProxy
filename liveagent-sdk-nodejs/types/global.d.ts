declare module "la";
declare namespace LAConfig {
    export type Config = {
        endpointUrl: string,
        version: number,
        organizationId: string,
        deploymentId: string,
        buttonId: string,
        proxy: string,
    }
}
declare namespace LAData {
    // - Salesforce Data Type
    export type Button = {
        id: string,
        type: 'Standard' | 'Invite' | 'ToAgent',
        endpointUrl: string,
        prechatUrl: string,
        language: string,
        isAvailable: boolean,
        inviteImageUrl: string,
        inviteImageWidth: number,
        inviteImageHeight: number,
        inviteRenderer: 'Slide' | 'Fade' | 'Appear' | 'Custom',
        inviteStartPosition: string,
        inviteEndPosition: string,
        hasInviteAfterAccept: boolean,
        hasInviteAfterReject: boolean,
        inviteRejectTime: number,
        inviteRules: object,
    }

    export type CustomDetail = {
        label: string,
        value: string,
        transcriptFields: Array<string>,
        displayToAgent: boolean,
    }

    export type EntityFieldsMaps = {
        fieldName: string,
        label: string,
        doFind: boolean,
        isExactMatch: boolean,
        doCreate: boolean,
    }

    export type Entity = {
        entityName: string,
        showOnCreate: boolean,
        linkToEntityName: string,
        linkToEntityField: string,
        saveToTranscript: string,
        entityFieldsMaps: Array<EntityFieldsMaps>,
    }

    export type GeoLocation = {
        countryCode: string,
        countryName: string,
        region: string,
        city: string,
        organization: string,
        latitude: number,
        longitude: number,
    }

    export type Message = {
        type: string,
        message: object,
    }

    export type NounWrapper = {
        prefix: string,
        noun: string,
        data: string,
    }

    export type Result = {
        id: string,
        isAvailable: boolean,
    }

    export type TranscriptEntry = {
        type: 'Agent' | 'Chasitor' | 'OperatorTransferred',
        name: string,
        content: string,
        timestamp: number,
        sequence: number,
    }
}
declare namespace LARequest {

    export type Location = {
        type : string,
        description: string,
        required: boolean,
        version: number,
    }

    export type Breadcrumb = {
        location: Location,
    }

    export type ChasitorInit = {
        organizationId: string,
        deploymentId: string,
        buttonId: string,
        sessionId: string,
        userAgent: string,
        language: string,
        screenResolution: string,
        visitorName: string,
        prechatDetails: Array<LAData.CustomDetail>,
        prechatEntities: Array<LAData.Entity>,
        buttonOverrides: Array<string>,
        receiveQueueUpdates: boolean,
        isPost: boolean,
    }

    export type ChasitorResyncState = {
        organizationId: string,
    }

    export type ChasitorSneakPeek = {
        position: number,
        text: string,
    }

    export type ChatMessage = {
        text: string,
    }

    export type CustomEvent = {
        type: string,
        data: string,
    }

    export type MultiNoun = {
        nouns: Array<LAData.NounWrapper>,
    }
}