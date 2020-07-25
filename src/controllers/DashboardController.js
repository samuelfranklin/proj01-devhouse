
//metodos: index, show, update, store, destroy

/*
    index: listagem de sessões,
    store: Criar uma sessão,
    show: Listar uma única sessão,
    update: Alterar/atualizar uma sessão,
    destroy: Deletar uma sessão
*/

import House from '../models/House';

class DashboardController {
    async show(req, res) {
        const { user_id } = req.headers;

        const houses = await House.find({ user: user_id });

        return res.json(houses);
    }
}

export default new DashboardController();