import mongoose from "mongoose";

const orderMechanicSchema = new mongoose.Schema({
    carOwner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    mechanic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    details: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'declined'],
        default: 'pending',
    },
    carOwnerLocation: {
        type: {
            type: String,
            enum: ['Point'],
            required: true,
        },
        coordinates: {
            type: [Number],
            required: true,
        },
    },
    mechanicLocation: {
        type: {
            type: String,
            enum: ['Point'],
            required: true,
        },
        coordinates: {
            type: [Number],
            required: true,
        },
    },
    route: {
        type: {
            type: String, // 'MultiLineString'
            enum: ['LineString', 'MultiLineString'], // Only allow these types
            required: true
        },
        coordinates: {
            type: [[[Number]]], // Array of arrays of arrays of numbers (longitude, latitude pairs)
            required: true
        },
        default: {}
    },

}, {
    timestamps: true,
});

orderMechanicSchema.index({ carOwnerLocation: '2dsphere' });
orderMechanicSchema.index({ mechanicLocation: '2dsphere' });

const OrderMechanic = mongoose.model("OrderMechanic", orderMechanicSchema);

export default OrderMechanic;
