import { execSync } from "child_process";

const address = "0x1acd0b4ebe4b18e5b6be3b7789c3ba137ea2393bab825da71fb25b9e5f6803de";
console.log("Fetching objects from CLI...");
const output = execSync(`sui client objects ${address} --json`, { encoding: "utf-8" });

const objects = JSON.parse(output);
console.log(`Successfully fetched ${objects.length} total objects from CLI.`);

const batches = objects.filter((o: any) => o.data?.type?.includes("chain_passport::OriginItem"));
console.log("Found Batches:", batches.length);
if (batches.length > 0) {
    console.log(batches.map((o: any) => ({
        id: o.data.objectId,
        type: o.data.type
    })));
}
