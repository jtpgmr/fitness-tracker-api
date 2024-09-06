import { CognitoIdentityProviderClient, DescribeUserPoolCommand, ListDevicesCommand, ListUsersCommand } from "@aws-sdk/client-cognito-identity-provider";
import { fromIni } from "@aws-sdk/credential-providers";

class CognitoInterface{
    client: CognitoIdentityProviderClient;

    region?: string;

    accessKeyId?: string;
    secretAccessKey?: string;

    profile?: string;

    
    constructor(
        { accessKeyId, secretAccessKey, profile = 'default', region = 'us-east-1' }: 
        { accessKeyId?: string, secretAccessKey?: string, region?: string, profile?: string } = {},
    ) {
        let credentials;

        if (accessKeyId && secretAccessKey) {
            credentials = { accessKeyId, secretAccessKey };
        } else if (profile) {
            credentials = fromIni({ profile });
        } else {
            throw new Error('Insufficient credentials provided');
        }

 
        this.client = new CognitoIdentityProviderClient({ credentials,  region });
    }
}

export default CognitoInterface;


