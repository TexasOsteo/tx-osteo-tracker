<template>
  <div>
    <h1 class="text-1xl font-bold">TEXAS OSTEOPROSIS FOUNDATION</h1>
    <h2 class="text-3xl text-center">SIGN UP</h2>
  </div>
  <div>
    <table class="table-fixed border-separate border-spacing-10">
      <tr class="text-center place-content-strech self-auto">
        <th>
          <FormKit
            type="select"
            name="location"
            label="Location"
            :options="{
              plano: 'Plano',
              dallas: 'Dallas',
              Frisco: 'Frisco',
            }"
          />
        </th>
        <th>Time</th>
        <th>Organization</th>
        <th>Even Category</th>
      </tr>
    </table>
  </div>
  <div><CalendarDisplay /></div>
</template>

<script setup lang="ts"></script>
