<template>
  <div class="container">
    <el-table :data="reservations" border class="table">
      <el-table-column prop="reservation_id" label="預約編號" />
      <el-table-column prop="student_id" label="學生編號" />
      <el-table-column prop="seat_id" label="座位編號" />
      <el-table-column prop="timeslot_id" label="時段編號" />
      <el-table-column prop="create_time" label="創建時間" />
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { Reservation } from './interfaces/Reservations';
import { asyncGet } from './utils/fetch';
import { apis } from './enum/api';
const reservations = ref<Array<Reservation>>([])

onMounted(() => {
  asyncGet(apis.test).then((resp: Array<Reservation>) => {
    reservations.value = resp
  })
})
</script>

<style scoped lang="scss">
.container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  .table {
    width: 80%;
    height: 60%;
  }
}
</style>
