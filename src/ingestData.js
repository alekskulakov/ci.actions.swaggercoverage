const { KustoConnectionStringBuilder } =  require('azure-kusto-data');
const {
    IngestClient: KustoIngestClient,
    IngestionProperties,
    DataFormat,
    IngestionMappingKind,
} =  require("azure-kusto-ingest");
const { Readable } = require("stream");

const args = process.argv.slice(2);

const repository = args[0];
const coverage = args[1];
const runId = args[2];

const data = {
    repository: repository,
    coverage: coverage,
    runId: runId,
    createdAt: new Date().toISOString()
};
const jsonString = JSON.stringify(data);
const stream = Readable.from([jsonString]);

const requiredEnvVars = [
    "KUSTO_AAD_APP_ID",
    "KUSTO_APP_KEY",
    "KUSTO_DEV_URI",
    "KUSTO_AAD_AUTHORITY_ID"
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
    console.warn(`⚠️ Missing required environment variables: ${missingVars.join(', ')}`);
} else {
    console.log("✅ All required environment variables are set.");

    const KUSTO_AAD_APP_ID = process.env.KUSTO_AAD_APP_ID;
    const KUSTO_APP_KEY = process.env.KUSTO_APP_KEY;
    const KUSTO_INGEST_URI = `https://ingest-${process.env.KUSTO_DEV_URI}`;
    const KUSTO_AAD_AUTHORITY_ID = process.env.KUSTO_AAD_AUTHORITY_ID;
    
    const kustoDatabase  = "metrics";
    const destTable = "services_coverage";
    const destTableMapping = "services_coverage_json_mapping";

    const kcsbIngest = KustoConnectionStringBuilder.withAadApplicationKeyAuthentication(
        KUSTO_INGEST_URI,
        KUSTO_AAD_APP_ID,
        KUSTO_APP_KEY,
        KUSTO_AAD_AUTHORITY_ID
    );

    const ingestionProps  = new IngestionProperties({
        database: kustoDatabase,
        table: destTable,
        format: DataFormat.JSON,
        ingestionMappingReference: destTableMapping,
        ingestionMappingKind: IngestionMappingKind.JSON,
    });
    const ingestClient = new KustoIngestClient(kcsbIngest, ingestionProps);

    console.log(`Ingesting new coverage: ${JSON.stringify(data)}`);
    ingestClient.ingestFromStream(stream, IngestionProperties)
        .then(() => console.log("Ingestion successful"))
        .catch(error => {
            console.error("Error ingesting data into Kusto:", error);
        });
}
