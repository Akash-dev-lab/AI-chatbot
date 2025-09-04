const { Pinecone } = require('@pinecone-database/pinecone')

const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY
});
const aiChatbotIndex = pc.index('ai-chatbot')

async function createMemory({vectors, metadata, messageId}) {
    await aiChatbotIndex.upsert([{
        id: messageId,
        values: vectors,
        metadata
    }])
}

async function queryMemory({queryVector, limit = 5, metadata}) {
    const data = await aiChatbotIndex.query({
        vector: queryVector,
        topK: limit,
        filter: metadata ? metadata : undefined,
        includeMetadata: true
    })
    
    return data.matches
}

module.exports = {createMemory, queryMemory}