import mongoose from "mongoose";

export interface IGrocery{
    _id?: mongoose.Types.ObjectId,
    name : string,
    category: string,
    price: number,
    image: string, 
    unit: number,
    createdAt: Date,
    updatedAt: Date,
    

}

const GrocerySchema = new mongoose.Schema<IGrocery>({
    name : {type: String, required: true},
    category: {type: String, enum : [
        "Fruit & Vegitables",
        "Bakery",
        "Dairy",
        "Snacks",
        "Spices & Masalas",
        "Personal Care",
        "Drinks",
        "Baby & Pet Care",
        "Rice, Atta & Grains",
        "Biscuits & Cookies",
        "Chocolates & Biscuits",
        "Sweets",
    ], required: true},
    price: {type: Number, required: true},
    image: {type: String, required: true}, 
    unit: {type: Number, required: true},
}, {timestamps: true})

const Grocery = mongoose.models.Grocery || mongoose.model("Grocery", GrocerySchema)

export default Grocery;