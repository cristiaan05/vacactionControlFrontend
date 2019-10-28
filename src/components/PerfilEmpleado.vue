<template>
  <div id="app">
    <md-toolbar  class="md-primary" md-elevation="1">
      <h3 class="md-title" style="flex: 1">Control Vacaciones</h3>
      <router-link to='/solicitudesEmpleado'>
        <md-button class="md-primary">Solicitudes</md-button>
      </router-link>
      <router-link to="/perfilEmpleado">
        <md-button class="md-primary">Vacaciones</md-button>
      </router-link>
      <md-button @click.prevent="logut">Cerrar Sesión</md-button>
    </md-toolbar>
    <!-------------------------------------- TABLA EMPLEADOS---------------------------------------- -->
    <md-table
      v-model="searched"
      md-sort="name"
      md-sort-order="asc"
      md-card
      md-fixed-header
      ref="table"
    >
      <md-table-toolbar>
        <div class="md-toolbar-section-start">
          <h1 class="md-title">Mis Vacaciones</h1>
        </div>
        <md-field md-clearable class="md-toolbar-section-end">
          <md-input placeholder="Buscar por nombre..." v-model="search" @input="searchOnTable" />
        </md-field>
      </md-table-toolbar>

      <md-table-empty-state
        md-label="No se encontraron periodos de vacaciones"
        :md-description="`No tiene periodos de Vacaciones. Contacte con su administrador`"
      >
        <md-button class="md-primary md-raised" @click="showDialog=true">Crear usuario</md-button>
      </md-table-empty-state>

      <md-table-row slot="md-table-row" slot-scope="{item}" v-bind="item">
        <md-table-cell md-label="Nombre" md-sort-by="nombre">{{item.empleado.nombre}}</md-table-cell>
        <md-table-cell md-label="Apellido" md-sort-by="apellido">{{ item.empleado.apellido }}</md-table-cell>
        <md-table-cell md-label="Apellido" md-sort-by="apellido">{{ item.empleado.dpi }}</md-table-cell>
        <md-table-cell md-label="Periodo" md-sort-by="periodo">{{ item.periodo }}</md-table-cell>
        <md-table-cell md-label="Dias Disponibles" md-sort-by="diasDisponibles">{{ item.diasDisponibles }}</md-table-cell>
      </md-table-row>
    </md-table>
    <!-- ------------------------------------------------------------------------------------------- -->
  </div>
</template>
<script>
/* eslint-disable */
import { validationMixin } from "vuelidate";
import moment from "moment";
import axios from "axios";
import {
  required,
  email,
  minLength,
  maxLength
} from "vuelidate/lib/validators";
const toLower = text => {
  return text.toString().toLowerCase();
};

const searchByName = (items, term) => {
  if (term) {
    return items.filter(item => toLower(item.nombre).includes(toLower(term)));
  }

  return items;
};

export default {
  name: "TableSearch",
  mixins: [validationMixin],
  mounted() {
    this.getTodos();
  },
  data: () => ({
    form: {
      nombre: null,
      apellido: null,
      fechaIngreso: null,
      fechaNacimiento: null,
      dpi: null,
      email: null
    },
    userSaved: false,
    sending: false,
    search: null,
    searched: [],
    users: [],
    showDialog: false,
    bottomPosition: "md-bottom-right",
    disabledDates: date => {
      const day = date.getDay();

      return day === 6 || day === 0;
    }
  }),
  validations: {
    form: {
      nombre: {
        required,
        minLength: minLength(3)
      },
      apellido: {
        required,
        minLength: minLength(3)
      },
      email: {
        required,
        email
      },
      dpi: {
        required,
        minLength: minLength(13),
        maxLength: maxLength(13)
      },
      fechaIngreso: {
        required
      },
      fechaNacimiento: {
        required
      }
    }
  },
  methods: {
    getTodos() {
        const AuthStr = localStorage.token;
      axios
        .get("http://localhost:3000/vacaciones", { 'headers': { 'Authorization': AuthStr } })
        .then(response => {
          this.search = "";
          this.users = response.data;
          console.log(this.users);
        })

        .catch(e => console.log(e));
    },
    newUser() {},
    searchOnTable() {
      this.searched = searchByName(this.users, this.search);
    },
    getValidationClass(fieldName) {
      const field = this.$v.form[fieldName];

      if (field) {
        return {
          "md-invalid": field.$invalid && field.$dirty
        };
      }
    },
    clearForm() {
      this.$v.$reset();
      this.form.nombre = null;
      this.form.apellido = null;
      this.form.dpi = null;
      this.form.gender = null;
      this.form.email = null;
      this.form.fechaIngreso = null;
      this.form.fechaNacimiento = null;
    },
    saveUser() {
      this.sending = true;
      // Instead of this timeout, here you can call your API
      axios
        .post("http://localhost:3000/agregarEmpleado", {
          nombre: this.form.nombre,
          apellido: this.form.apellido,
          dpi: this.form.dpi,
          email: this.form.email,
          fechaNacimiento: this.form.fechaNacimiento,
          fechaIngreso: this.form.fechaIngreso
        })
        .then(response => {
          // eslint-disable-next-line
          console.log(response.data);
          window.setTimeout(() => {
            this.userSaved = true;
            this.sending = false;
            this.clearForm();
            this.users = this.users;
            this.getTodos();
          }, 1500);
          this.getTodos();
          this.showDialog = false;
        })
        .catch(e => {
          console.log("no se pudo agregar");
          console.log(e);
        });
      this.getTodos();
    },
    deleteUser(id) {
      // Instead of this timeout, here you can call your API
      axios
        .delete("http://localhost:3000/eliminarEmpleado/" + id, {})
        .then(response => {
          // eslint-disable-next-line
          console.log(response.data);
        })
        .catch(e => {
          console.log("no se pudo eliminar");
          console.log(e);
        });
      this.getTodos();
    },
    aceptar(id) {
      const config = { headers: { "Content-Type": "application/json" } };
      axios
        .put("http://localhost:3000/estado/" + id, {
          status: "aceptado"
        })
        .then(response => {
          // this.getTodos()
          // eslint-disable-next-line
          this.getTodos();
          console.log(response.data);
        })
        .catch(e => {
          // eslint-disable-next-line
          console.log(e);
        });
    },
    rechazar(id) {
      axios
        .post("http://localhost:3000/estado/" + id, {
          status: "rechazado"
        })
        .then(response => {
          // this.getTodos()
          // eslint-disable-next-line
          this.getTodos();
          console.log(response.data);
        })
        .catch(e => {
          // eslint-disable-next-line
          console.log(e);
        });
    },
    validateUser() {
      this.$v.$touch();

      if (!this.$v.$invalid) {
        this.saveUser();
      }
    },
    date(value) {
      if (value) {
        return moment(String(value)).format("DD-MM-YYYY");
      }
    },
    logut: function() {
      this.$store
        .dispatch("logout")
        .then(() => this.$router.push("/"))
        .catch(err => console.log(err));
    }
  },
  created() {
    this.searched = this.users;
  }
};
</script>

<style lang="scss" scoped>
.md-table {
  width: 100%;
  height: 100%;
  border-collapse: collapse;
  padding: 5%;
}
.md-table-row {
  background-color: rgb(184, 180, 180);
  width: 40%;
  padding: 0%;
}
.md-table-cell {
  background-color: white;
  width: 0%;
}
.users {
  font-family: verdana;
}
.md-title {
  font-weight: bold;
}
.md-title {
  text-align: left;
}
.md-fab {
  color: rgb(102, 30, 30);
  align-self: right;
}
.material-icons {
  color: white;
}

.md-field {
  max-width: 300px;
}
.md-dialog {
  max-width: 768px;
}
.md-progress-bar {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
}
</style>