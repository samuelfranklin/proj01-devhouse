import { json } from 'express';
import { House, User, Reserve } from '../models';



class ReserveController {
    async index (req, res) {
        const { user_id } = req.headers;

        const reserves = await Reserve.find({ user: user_id }).populate('house');

        return res.json(reserves);
    }

    async store(req, res) {
        const { user_id } = req.headers;
        const { house_id } = req.params;
        const { date } = req.body;

        const house = await House.findById(house_id);
        const user = await User.findById(user_id);

        if(!house) return res.status(400).json({ error: 'Essa casa não existe!' });
        
        if (!house.status) return res.status(400).json({ error: 'Essa casa não está disponível' });

        if (user._id.toString() === house.user.toString()) return res.status(401).json({ error: 'Não é possível reservar sua prórpria casa!' });

        const reserve = await Reserve.create({
            user: user_id,
            house: house_id,
            date
        });

        await House.updateOne({ _id: house_id }, { status: false });

        await reserve.populate('house').populate('user').execPopulate();

        return res.json(reserve);
    } 

    async destroy(req, res) {
        const { user_id } = req.headers;
        const { reserve_id } = req.body;

        const reserve = await Reserve.findById(reserve_id);
        const user = await User.findById(user_id);
        const house = await House.findById(reserve.house);

        if(user._id.toString() !== reserve.user.toString()) return res.json({ error: 'Somente o usuário que criou a reserva pode cancelá-la!' })

        await Reserve.findByIdAndDelete({ _id: reserve_id });
        await House.updateOne( { _id: house._id }, { status: true });

        return res.send('Reserva desfeita com sucesso!');
    }
}

export default new ReserveController();

