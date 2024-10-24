<template></template>

<script setup>
const { data } = defineProps(["data"]);

let columns = [];
let items = [];

for (const [key] of Object.entries(data[0])) {
  columns.push({
    key: key,
    _prop: { scope: "col" },
  });
}

for (let item of data) {
  let tempItem = item;
  tempItem["_cellProps"] = {
    id: { scope: "row" },
  };
  items.push(tempItem);
}
</script>
