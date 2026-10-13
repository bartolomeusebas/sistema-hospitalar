const Anthropic = require("@anthropic-ai/sdk");
const fs = require("fs");
const path = require("path");

const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
});

const MODEL = process.env.ANTHROPIC_MODEL || "claude-3-5-sonnet-20241022";

const resultadoDemonstracao = (tipoExame, motivo) => ({
    sucesso: true,
    demonstracao: true,
    modelo: "modo-demonstracao-local",
    motivo,
    diagnostico: `RESULTADO DEMONSTRATIVO - NÃO REPRESENTA DIAGNÓSTICO MÉDICO REAL\n\nExame: ${tipoExame || "Radiografia do tórax"}\n\nAchados simulados: não foram identificadas alterações relevantes no cenário de demonstração.\n\nRecomendação: este resultado serve apenas para demonstrar o fluxo do sistema e deve ser substituído por uma avaliação médica real.`
});

if (!process.env.ANTHROPIC_API_KEY) {
    console.warn("ANTHROPIC_API_KEY não configurada. A análise por IA ficará indisponível.");
}

const iaService = {
    // Analisar imagem de exame
    analisarExame: async (caminhoImagem, tipoExame, descricao) => {
        try {
            // Ler a imagem e converter para base64
            const imagemBuffer = fs.readFileSync(caminhoImagem);
            const imagemBase64 = imagemBuffer.toString("base64");
            
            // Determinar o tipo MIME
            const ext = path.extname(caminhoImagem).toLowerCase();
            let mediaType = "image/jpeg";
            if (ext === ".png") mediaType = "image/png";
            if (ext === ".gif") mediaType = "image/gif";
            if (ext === ".webp") mediaType = "image/webp";
            if (ext === ".jpg") mediaType = "image/jpeg";
            if (ext === ".jpeg") mediaType = "image/jpeg";
            if (ext === ".dcm") {
                return resultadoDemonstracao(tipoExame, "DICOM não suportado no modo de demonstração");
            }

            const prompt = `
Você é um assistente médico especializado em análise de exames de imagem.

Tipo de Exame: ${tipoExame}
Descrição do Exame: ${descricao || "Sem descrição adicional"}

Analise a imagem do exame e forneça:
1. **Achados Principais**: O que você observa na imagem
2. **Possíveis Diagnósticos**: Diagnósticos mais prováveis (com confiança em %)
3. **Recomendações**: Próximos passos ou exames adicionais
4. **Observações**: Qualquer informação relevante

Responda em formato estruturado e claro.
            `;

            const response = await client.messages.create({
                model: MODEL,
                max_tokens: 1024,
                messages: [
                    {
                        role: "user",
                        content: [
                            {
                                type: "image",
                                source: {
                                    type: "base64",
                                    media_type: mediaType,
                                    data: imagemBase64
                                }
                            },
                            {
                                type: "text",
                                text: prompt
                            }
                        ]
                    }
                ]
            });

            return {
                sucesso: true,
                diagnostico: response.content[0].text,
                modelo: MODEL
            };
        } catch (err) {
            console.error("Erro ao analisar exame:", err);
            return resultadoDemonstracao(tipoExame, "A análise online não está disponível; foi usado o modo de demonstração local");
        }
    },

    // Analisar apenas descrição (sem imagem)
    analisarDescricao: async (tipoExame, descricao) => {
        try {
            const prompt = `
Você é um assistente médico especializado em análise de exames.

Tipo de Exame: ${tipoExame}
Descrição do Exame: ${descricao}

Com base na descrição fornecida, analise e forneça:
1. **Achados Principais**: O que foi descrito
2. **Possíveis Diagnósticos**: Diagnósticos mais prováveis (com confiança em %)
3. **Recomendações**: Próximos passos ou exames adicionais
4. **Observações**: Qualquer informação relevante

Responda em formato estruturado e claro.
            `;

            const response = await client.messages.create({
                model: MODEL,
                max_tokens: 1024,
                messages: [
                    {
                        role: "user",
                        content: prompt
                    }
                ]
            });

            return {
                sucesso: true,
                diagnostico: response.content[0].text,
                modelo: MODEL
            };
        } catch (err) {
            console.error("Erro ao analisar descrição:", err);
            return resultadoDemonstracao(tipoExame, "A análise online não está disponível; foi usado o modo de demonstração local");
        }
    }
};

module.exports = iaService;