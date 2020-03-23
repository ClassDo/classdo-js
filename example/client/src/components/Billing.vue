<template>
  <div>Billing
    <form>
      <fieldset class="fallbackDatePicker">
        <label>
          Month:
          <select v-model="month" name="month" @change="getBilling">
            <option value="1">January</option>
            <option value="2">February</option>
            <option value="3">March</option>
            <option value="4">April</option>
            <option value="5">May</option>
            <option value="6">June</option>
            <option value="7">July</option>
            <option value="8">August</option>
            <option value="9">September</option>
            <option value="10">October</option>
            <option value="11">November</option>
            <option value="12">December</option>
          </select>
        </label>
    
        <label>
          Year:
          <select v-model="year" name="year" @change="getBilling">
            <option>2020</option>
            <option>2021</option>
            <option>2022</option>
            <option>2023</option>
            <option>2024</option>
          </select>
        </label>
      </fieldset>
    </form>
    <table>
      <thead>
        <tr>
          <th>date</th>
          <th>ledger type</th>
          <th>sec</th>
          <th>amount</th>
          <th>user</th>
          <th>room</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="v in tableData" :key="v.id">
          <td>{{ v.date }}</td>
          <td>{{ v.ledgerType }}</td>
          <td>{{ v.sec }}</td>
          <td>{{ v.amount }}</td>
          <td>{{ v.user }}</td>
          <td>{{ v.room }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { User, Room } from './Organization.vue'
import client from '../apis/client'

type Billing = { id: string; year: number; month: number; records: BillingRecord[] }
type BillingRecord = {
  id: string;
  date: string;
  usages: UsageLedger[];
  freeCredits: UsageLedger[];
  topups: UsageLedger[];
}
type UsageLedger = { id: string; ledgerType: string; amount: number; paidSec: number; user: User; room: Room }
type State = {
  billing: Billing | null;
  year: string;
  month: string;
}
type TableRow = {
  id: string;
  date: string;
  ledgerType: string;
  sec: number;
  amount: number;
  user: string;
  room: string;
}
export default Vue.extend({
  data(): State {
    return { billing: null, year: new Date().getFullYear().toString(), month: (new Date().getMonth() + 1).toString() }
  },
  computed: {
    tableData(): TableRow[] {
      return this.billing && this.billing.records.map(v => {
        const date = v.date
        const usages: TableRow[] =
          v.usages.map(v => ({
            id: v.id,
            date,
            ledgerType: v.ledgerType,
            sec: v.paidSec,
            amount: v.amount,
            user: v.user ? `${v.user.profile.firstName} ${v.user.profile.lastName}` : '',
            room: v.room ? v.room.name : ''
          }))
        const topups: TableRow[] = 
          v.topups.map(v => ({
            id: v.id,
            date,
            ledgerType: v.ledgerType,
            sec: v.paidSec,
            amount: v.amount,
            user: '',
            room: ''
          }))
        const freeCredits: TableRow[] = 
          v.freeCredits.map(v => ({
            id: v.id,
            date,
            ledgerType: v.ledgerType,
            sec: v.paidSec,
            amount: v.amount,
            user: '',
            room: ''
          }))
        return usages.concat(topups).concat(freeCredits)
      }).flat() || []
    }
  },
  methods: {
    async getBilling() {
      const billing = await client.withAuth().get<Billing>('/api/billing', {
        data: {
          year: this.year,
          month: this.month
        }
      })
      this.billing = billing.data
    }
  },
  mounted() {
    this.getBilling()
  }
})
</script>