import mongoose from "mongoose";


interface IGrocery {
    _id?: mongoose.Types.ObjectId;
    name: string;
    price: string;
    category: string;
    image: string;
    unit: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const grocerySchema = new mongoose.Schema<IGrocery>({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        enum:[
            "Fruits & Vegetables",
            "Dairy & Eggs",
            "Rice, wheat, & pulses",
            "Snacks & Biscuits",
            "Beverages & Juices",
            "Personal Care & Hygiene",
            "Home Care & Cleaning",
            "Incidental Items",
            "Grocery",

        ],
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    unit: {
        type: String,
        required: true,
        },
}, {
    timestamps: true,
});

 const Grocery = mongoose.models.Grocery || mongoose.model("Grocery", grocerySchema);

 export default Grocery