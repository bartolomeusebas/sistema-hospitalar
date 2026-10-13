const bcrypt = require('bcryptjs');
const db = require('../service/database');

const demoUsers = [
    { email: 'mendesjustino@gmail.com', senha: '123456' },
    { email: 'bartolomeusebas@gmail.com', senha: '123456' }
];

(async () => {
    try {
        for (const user of demoUsers) {
            const passwordHash = await bcrypt.hash(user.senha, 12);
            const [result] = await db.query(
                'UPDATE users SET senha = ? WHERE email = ?',
                [passwordHash, user.email]
            );
            if (result.affectedRows === 0) {
                throw new Error(`Utilizador não encontrado: ${user.email}`);
            }
        }

        console.log('Utilizadores de demonstração preparados com sucesso.');
        console.log('Médico: mendesjustino@gmail.com / 123456');
        console.log('Administrador: bartolomeusebas@gmail.com / 123456');
    } catch (error) {
        console.error('Não foi possível preparar os utilizadores:', error.message);
        process.exitCode = 1;
    } finally {
        await db.end();
    }
})();
