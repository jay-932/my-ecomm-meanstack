const Order = require("./../db/order");

async function addOrder(userId, orderModel) {

    let order = new Order({
        ...orderModel,
        userId: userId,
        status:"inprogress"
    });
    await order.save();
   
    
}

async function getCustomerOrders(userId) {
    let orders = await Order.find({userId: userId});
    return orders.map((x)=>x.toObject());
    
}

async function getOrders() {
    let orders = await Order.find();
    return orders.map((x)=>x.toObject());
    
}

async function updateOrderStatus(id, status) {
    const order = await Order.findByIdAndUpdate(id, { status: status }, { new: true });
    return order; // ✅ Updated order return karein
}



module.exports = {addOrder,getCustomerOrders,getOrders,updateOrderStatus};