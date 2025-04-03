const express = require("express");
const router = express.Router();
const { getOrders,updateOrderStatus } = require("../handlers/order-handler");

router.get("", async(req, res)=>{
    const orders = await getOrders();
    res.send(orders);
});


router.put("/:id", async (req, res) => {
    const id = req.params.id;
    const status = req.body.status;

    // ✅ Ensure Order Exists
    const order = await updateOrderStatus(id, status);
    if (!order) {
        return res.status(404).json({ message: "Order Not Found!" });
    }

    res.json({ message: "Order Status Updated Successfully!", order });
});


module.exports = router;
