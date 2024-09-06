import { Request, Response, NextFunction } from 'express';
import { expressjwt, GetVerificationKey, UnauthorizedError } from 'express-jwt';
import { expressJwtSecret } from 'jwks-rsa';

type ValidExpressJwtAlgorithm = "HS256" | "HS384" | "HS512" | "RS256" | "RS384" | "RS512" | "ES256" | "ES384" | "ES512" | "PS256" | "PS384" | "PS512" | "none"

const verifyJwt = 
    ({ algorithms, jwksUri, issuer }: { algorithms: string| string[], jwksUri: string, issuer: string}) => 
        (req: Request, res: Response, next: NextFunction) => {
            if (!Array.isArray(algorithms)) {
                algorithms = algorithms.split(',');
            }
            expressjwt({
                secret: expressJwtSecret({
                    cache: true,
                    rateLimit: true,
                    jwksRequestsPerMinute: 5,
                    jwksUri,
                }) as GetVerificationKey,
                issuer,
                algorithms: algorithms as ValidExpressJwtAlgorithm[],
            })(req, res, err => {
                if (err instanceof UnauthorizedError) {
                    const { message, name, status } = err;
                    return res.status(status).send({ hasErrors: true,  data: [{ name, message }]  });
                }
                next();
            }); 
        };

export default verifyJwt;