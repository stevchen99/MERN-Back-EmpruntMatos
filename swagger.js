const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const setupSwagger = (app, port) => {
    // 1. Déterminer l'URL (Vercel fournit automatiquement VERCEL_URL en prod)
    const serverUrl = process.env.VERCEL_URL 
        ? `https://${process.env.VERCEL_URL}` 
        : `http://localhost:${port}`;

    const swaggerOptions = {
        definition: {
            openapi: '3.0.0',
            info: {
                title: 'Gestion Emprunt Matériel API',
                version: '1.0.0',
                description: 'API pour la gestion des personnes et du matériel',
            },
            servers: [
                { url: serverUrl }
            ],
            components: {
                schemas: {
                    Person: {
                        type: 'object',
                        required: ['nom', 'prenom', 'email'],
                        properties: {
                            nom: { type: 'string' },
                            prenom: { type: 'string' },
                            tel: { type: 'string' },
                            email: { type: 'string' }
                        }
                    },
                    Material: {
                        type: 'object',
                        required: ['libelle', 'kaution'],
                        properties: {
                            libelle: { type: 'string' },
                            kaution: { type: 'number' },
                            disponible: { type: 'boolean' }
                        }
                    },
                    Borrowing: {
                        type: 'object',
                        required: ['personId', 'materialId'],
                        properties: {
                            personId: { type: 'string', description: 'ID de la personne' },
                            materialId: { type: 'string', description: 'ID du matériel' },
                            dateRetourPrevue: { type: 'string', format: 'date' },
                            estRendu: { type: 'boolean' }
                        }
                    }
                }
            }
        },
        // On pointe vers le dossier routes
        apis: ['./routes/*.js'], 
    };

    const swaggerDocs = swaggerJsDoc(swaggerOptions);

    // 2. Utilisation des CDNs pour éviter les bugs d'affichage sur Vercel
    const CSS_URL = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css";

    app.use(
        '/api-docs',
        swaggerUi.serve,
        swaggerUi.setup(swaggerDocs, {
            customCssUrl: CSS_URL,
            customJs: [
                "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui-bundle.js",
                "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui-standalone-preset.js",
            ]
        })
    );

    console.log(`📄 Swagger configuré pour ${serverUrl}`);
};

module.exports = setupSwagger;