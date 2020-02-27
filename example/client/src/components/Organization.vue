<template>
  <div>
    <h1>{{ organizationName }}</h1>
    <button class="button-logout" @click.prevent="logout">logout</button>
    <div class="rooms">
      <div class="room-list">
        <h2>RoomList</h2>
        <hr />
        <div class="room-items">
          <p
            class="room-item"
            :class="{ selected: v.id === selectedRoomId}"
            :key="v.id"
            v-for="v in rooms"
            @click="selectedRoomId=v.id"
          >
            {{ v.name }}
          </p>
        </div>
        <div class="room-actions">
          <form @submit.prevent="createRoom">
            <input v-model="createRoomName" />
            <button type="submit">Create</button>
          </form>
        </div>
      </div>
      <div class="room-detail">
        <h2>RoomDetail</h2>
        <hr />
        <div v-if="selectedRoom" class="selected-room">
          <div class="room-members">
            <h3>members</h3>
            <div class="room-member-list">
              <p :key="v.id" v-for="v in roomMembers">{{ v.user.profile.lastName + ' ' + v.user.profile.firstName }}</p>
            </div>
          </div>
          <a class="link-enter-room" :href="selectedRoomUrl" target="_blank">EnterRoom</a>
          <div class="room-member-actions">
            <form @submit.prevent="inviteMember">
              <label>
                Name
                <input v-model="inviteName" />
              </label>
              <label>
                Email
                <input v-model="inviteEmail" />
              </label>
              <button>InviteMember</button>
            </form>
          </div>
        </div>
        <div v-else>
          Select a room from RoomList
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import client from '../apis/client'
import accessToken from '../apis/accessToken'

type Organization = { id: string; name: string }
type Profile = { firstName: string; lastName: string }
type User = { id: string; profile: Profile }
type RoomMember = { id: string; name: string; user: User }
type Room = { id: string; name: string; members: RoomMember[] }
type State = {
  organization: Organization | null;
  rooms: Room[];
  createRoomName: string;
  selectedRoomId: string | null;
  inviteEmail: '';
  inviteName: '';
}

export default Vue.extend({
  data(): State {
    return { organization: null, rooms: [], selectedRoomId: null, createRoomName: '', inviteEmail: '', inviteName: '' }
  },
  computed: {
    organizationName(): string {
     return this.organization && this.organization.name || ''
    },
    selectedRoom(): Room | void {
      return this.rooms.find(v => v.id === this.selectedRoomId)
    },
    roomMembers(): RoomMember[] {
      if (!this.selectedRoom) {
        return []
      }
      return this.selectedRoom.members
    },
    selectedRoomUrl(): string {
      if (!this.selectedRoom) {
        return ''
      }
      return `https://classdo.com/classroom/${this.selectedRoom.id}`
    }
  },
  methods: {
    logout() {
      accessToken.set('')
      this.$router.push('/login')
    },
    async getOrganization() {
      const organization = await client.withAuth().get<Organization>('/api/organization')
      this.organization = organization.data
    },
    async getRooms() {
      const rooms = await client.withAuth().get<Room[]>('/api/rooms')
      this.rooms = rooms.data
    },
    async createRoom() {
      await client.withAuth().post<Room>('/api/room', {
        data: { name: this.createRoomName }
      })
      this.getRooms()
    },
    async inviteMember() {
      await client.withAuth().post('/api/invite', {
        data: { name: this.inviteName, email: this.inviteEmail, roomId: this.selectedRoomId }
      })
    }
  },
  async mounted() {
    await this.getOrganization()
    await this.getRooms()
  }
})
</script>

<style scoped>
.button-logout {
  position: absolute;
  top: 63px;
  right: 50px;
  width: 100px;
  height: 40px;
  border-radius: 4px;
}

.rooms {
  display: flex;
  margin: 0 16px;
}

.room-list {
  flex: 1;
  height: 500px;
  border: 1px grey solid;
  border-radius: 4px;
  margin-right: 16px;
}

.room-items {
  border-bottom: 1px grey solid; 
  height: 382px;
}

.room-item:hover {
  cursor: pointer;
}

.selected {
  color:blue;
}

.room-detail {
  flex: 2;
  height: 500px;
  border: 1px grey solid;
  border-radius: 4px;
}

.room-member-list {
  height: 334px;
  border-bottom: 1px grey solid; 
}

.selected-room {
  position: relative;
}

.link-enter-room {
  position: absolute;
  top: 0;
  right: 10px;
}

</style>