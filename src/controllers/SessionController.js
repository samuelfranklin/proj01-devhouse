
//metodos: index, show, update, store, destroy

/*
    index: listagem de sessões,
    store: Criar uma sessão,
    show: Listar uma única sessão,
    update: Alterar/atualizar uma sessão,
    destroy: Deletar uma sessão
*/

import User from '../models/User';

class SessionController{
    async store(req, res) {
        const { email } =  req.body;

        //verifica se o usuário já existe
        let user = await User.findOne({ email });

        return !user
            ? (user = await User.create({ email }), res.json(user))
            : res.json({ message: 'Erro: Ups! Usuário já existe', user })

    }
}

export default new SessionController();