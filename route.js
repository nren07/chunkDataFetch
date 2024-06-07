async function fetchDataInChunks(sourceUrl, destinationUrl) {
    const response = await fetch(sourceUrl);

    if (!response.body) {
        throw new Error('ReadableStream not supported in this browser.');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');

    let chunkCounter = 0;

    while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
            console.log("Stream complete");
            break;
        }

        chunkCounter++;
        const chunkText = decoder.decode(value, { stream: true });
        console.log(`Received chunk ${chunkCounter}:`, chunkText);

        // Send the chunk to the destination API
        await sendChunkToApi(destinationUrl, chunkText, chunkCounter);
    }
}

async function sendChunkToApi(destinationUrl, chunkText, chunkCounter) {
    try {
        const response = await fetch(destinationUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chunkNumber: chunkCounter,
                data: chunkText
            })
        });

        if (!response.ok) {
            throw new Error(`Failed to send chunk ${chunkCounter}: ${response.statusText}`);
        }

        const responseData = await response.json();
        console.log(`Chunk ${chunkCounter} sent successfully. Response:`, responseData);
    } catch (error) {
        console.error(`Error sending chunk ${chunkCounter}:`, error);
    }
}

// Example usage
const sourceUrl = 'https://api.example.com/source'; // Replace with your source API URL
const destinationUrl = 'https://api.example.com/destination'; // Replace with your destination API URL

fetchDataInChunks(sourceUrl, destinationUrl);

console.log("route js");
module.exports={fetchDataInChunks};