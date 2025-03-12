<template>
  <div class="container">
    <h1>多日預約</h1>
    <div class="form-group">
      <input type="text" v-model="studentId" placeholder="學生ID" />
      <input type="text" v-model="seatId" placeholder="座位ID" />
      <input type="date" v-model="startDate" />
      <input type="date" v-model="endDate" />
      <input type="text" v-model="timeSlot" placeholder="時段" />
      <button class="btn-light" @click="createMultiDayReservation">提交預約</button>
    </div>

    <h1>查詢學生預約狀態</h1>
    <div class="form-group">
      <input type="text" v-model="queryStudentId" placeholder="學生ID" />
      <button class="btn-light" @click="getStudentReservations">查詢預約</button>
    </div>

    <el-table :data="reservations" border class="table">
      <el-table-column prop="reservation_id" label="預約編號" />
      <el-table-column prop="student.student_name" label="學生姓名" />
      <el-table-column prop="seat.row_label" label="座位" />
      <el-table-column prop="seat.seat_number" label="座號" />
      <el-table-column prop="timeslot.start_time" label="開始時間" />
      <el-table-column prop="timeslot.end_time" label="結束時間" />
      <el-table-column prop="create_time" label="創建時間" />
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { Reservation } from './interfaces/Reservations';
import { asyncGet, asyncPost } from './utils/fetch';
import { apis } from './enum/api';

const reservations = ref<Array<Reservation>>([]);
const studentId = ref('');
const seatId = ref('');
const startDate = ref('');
const endDate = ref('');
const timeSlot = ref('');
const queryStudentId = ref('');

const createMultiDayReservation = async () => {
  try {
    const response = await asyncPost(apis.multiDayReservation, {
      studentId: studentId.value,
      seatId: seatId.value,
      startDate: startDate.value,
      endDate: endDate.value,
      timeSlot: timeSlot.value,
    });
    console.log('預約成功:', response);
    alert('預約成功');
  } catch (error) {
    console.error('預約失敗:', error);
    alert('預約失敗');
  }
};

const getStudentReservations = async () => {
  try {
    const response = await asyncGet(`${apis.studentReservations}/${queryStudentId.value}`);
    reservations.value = response;
  } catch (error) {
    console.error('查詢失敗:', error);
    alert('查詢失敗');
  }
};
</script>

<style scoped lang="scss">
.container {
  width: 100%;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;

  .form-group {
    margin-bottom: 20px;
    input {
      margin-right: 10px;
    }
    .btn-light {
      background-color: #f0f8ff; /* 淺藍色背景 */
      color: #000; /* 黑色文字 */
      border: 1px solid #ccc; /* 灰色邊框 */
      padding: 5px 10px;
      border-radius: 5px;
      cursor: pointer;
      transition: background-color 0.3s;
    }
    .btn-light:hover {
      background-color: #e0f0ff; /* 更浅的藍色背景 */
    }
  }

  .table {
    width: 80%;
  }
}
</style>