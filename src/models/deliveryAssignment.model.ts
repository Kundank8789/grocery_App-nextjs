import mongoose from "mongoose";

interface IDeliveryAssignment{
    _id?: mongoose.Types.ObjectId
    orders: mongoose.Types.ObjectId
    brodcastTo: mongoose.Types.ObjectId[]
    assignedTo: mongoose.Types.ObjectId | null
    status:"brodcasted" | "assigned" | "completed"
    acceptedAt: Date
    createdAt?: Date
    updatedAt?: Date
}

const deliveryAssignmentSchema= new mongoose.Schema<IDeliveryAssignment>({
    orders: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
    },
    brodcastTo: [ 
        {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User",
        }
    ],
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    status:{
        type: String,
        enum: ["brodcasted", "assigned", "completed"],
        default: "brodcasted"
    },
    acceptedAt: {
        type: Date
    }
},{timestamps: true})

const DeliveryAssignment = mongoose.models.DeliveryAssignment || mongoose.model("DeliveryAssignment", deliveryAssignmentSchema);

export default DeliveryAssignment