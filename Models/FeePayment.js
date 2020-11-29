const mongoose=require("mongoose");

const FeePaymentSchema = new mongoose.Schema();

FeePaymentSchema.add({
    requesterId:{
        type:String,
        required:true,
    },
    requesterName:{
        type:String,
        default:''
    },
    requestedToId:{
        type:String,
        required:true,
    },
    requestedToName:{
        type:String,
        required:true,
    },
    orderId:{
        type:String,
    },
    items:{
        type:String,
        default:null
    },
    amount:{
        type:Number,
        required:true,
    },
    currency:{
        type:String,
        required:true,
        uppercase:true,
        default:"INR"
    },
    paymentId:{
        type:String,
        default:null
    },
    status:{
        type:String,
        uppercase:true,
        default:"CREATED"
    },
    createdAt:{
        type:Date,
        required:true
    },
    error:{
        type:String,
        default:null
    },
    signature:{
        type:String,
        default:null
    },
    party:{
        type:String,
        default:"RAZORPAY",
        uppercase:true
    }
});

const FeePayment = mongoose.model("FeePayment",FeePaymentSchema);
//module.exports=FeePayment;
exports.FeePayment = FeePayment;
