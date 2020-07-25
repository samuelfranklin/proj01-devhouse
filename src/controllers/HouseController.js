import House from '../models/House';
import User from '../models/User';

class HouseController {

    async index(req, res) {
        const { status } = req.query;
        const houses = await House.find({ status });

        return res.json(houses);

        
        return res.json({ ok: false });
    }

    async store(req, res) {
        const { filename } = req.file;
        const { description, price, location, status } = req.body;
        const { user_id } = req.headers;

        const house = await House.create({
            user: user_id,
            thumbnail: filename,
            description,
            price, 
            location,
            status,
        });

        return res.json(house);
    }

    async update(req, res) { 
        const { filename } = req.file;
        const { house_id } = req.params;
        const { description, price, location, status } = req.body;
        const { user_id } = req.headers;

        const user = await User.findById(user_id);
        const house = await House.findById(house_id);

        if(String(user_id) !== String(house.user)) {
            return res.status(401).json({
                error: "ERROR: Você não tem permissão para alterar este registro!"
            });
        }

        await House.updateOne({ _id: house_id }, {
            user: user_id,
            thumbnail: filename,
            description,
            price, 
            location,
            status,
        });

        return res.json({ message: "Informações sobre a casa alteradas com sucesso!" });
    }

    async destroy(req, res) {
        const { house_id } = req.body;
        const { user_id } = req.headers;

        const user = await User.findById(user_id);
        const house = await House.findById(house_id);

        if (String(user_id) !== String(house.user)) {
            return res.status(401).json({
                error: "ERROR: Você não tem permissão para deletar este registro!"
            });
        }
        
        await House.findByIdAndDelete({ _id: house_id });

        return res.json({ message: "Casa removida com sucesso." });
    }
}

export default new HouseController();