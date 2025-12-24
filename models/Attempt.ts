import mongoose, {Schema, model, models} from 'mongoose';
const AttemptSchema = new Schema({
    problemId:{
        type: String,
        required: true,
        index: true,
    },
    content:{
        type:String,
        required:true,
    },
    timestamp:{
        type:Date,
        default:Date.now,
    }
});


const Attempt = models.Attempt || model('Attempt', AttemptSchema);
export default Attempt;