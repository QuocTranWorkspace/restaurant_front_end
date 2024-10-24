<template></template>

<script setup>
import { ordersStore } from "@/stores/data/OrderData";

const orderStoreInit = ordersStore();

orderStoreInit.fetchOrders();
</script>
