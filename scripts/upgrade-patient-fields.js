const db = require('../service/database');

const fields = [
    ['tipo_sanguineo', 'VARCHAR(5) NULL'],
    ['alergias', 'TEXT NULL'],
    ['medico_responsavel', 'VARCHAR(150) NULL'],
    ['condicoes_ativas', 'TEXT NULL']
];

(async () => {
    try {
        for (const [name, definition] of fields) {
            try {
                await db.query(`ALTER TABLE pacientes ADD COLUMN ${name} ${definition}`);
                console.log(`Campo ${name} adicionado.`);
            } catch (error) {
                if (error.code === 'ER_DUP_FIELDNAME') {
                    console.log(`Campo ${name} já existe.`);
                } else {
                    throw error;
                }
            }
        }
        console.log('Estrutura de pacientes atualizada.');
    } catch (error) {
        console.error('Não foi possível atualizar pacientes:', error.message);
        process.exitCode = 1;
    } finally {
        await db.end();
    }
})();
