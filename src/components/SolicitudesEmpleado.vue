<template>
  <div id="app">
    <md-toolbar class="md-primary" md-elevation="1">
      <h3 class="md-title" style="flex: 1">Control de Vacaciones</h3>
      <router-link to="/solicitudesEmpleado">
        <md-button class="md-primary">Solicitudes</md-button>
      </router-link>
      <router-link to="/perfilEmpleado">
        <md-button class="md-primary">Vacaciones</md-button>
      </router-link>
      <md-button @click.prevent="logut">Cerrar Sesión</md-button>
    </md-toolbar>
    <!-------------------------------------- TABLA SOLICITUD EMPLEADO---------------------------------------- -->
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
          <h1 class="md-title">Mis Solicitudes</h1>
        </div>
        <md-field md-clearable class="md-toolbar-section-end">
          <md-input placeholder="Buscar por nombre..." v-model="search" @input="searchOnTable" />
        </md-field>
      </md-table-toolbar>

      <md-table-empty-state
        md-label="No se encontro la solicitud"
        :md-description="`No se encontraron coincidencias. Intenta con un nombre diferente o crea una solicitud con ese nombre.`"
      >
        <md-button class="md-primary md-raised" @click="showDialog=true">Crear Solicitud</md-button>
      </md-table-empty-state>

      <md-table-row slot="md-table-row" slot-scope="{item}" v-bind="item">
        <md-table-cell md-label="Id" md-sort-by="id">{{item.id}}</md-table-cell>
        <md-table-cell md-label="Periodo" md-sort-by="periodo">{{item.periodo}}</md-table-cell>
        <md-table-cell
          md-label="Dias Solicitados"
          md-sort-by="diasSolicitados"
        >{{ item.diasSolicitados }}</md-table-cell>
        <md-table-cell md-label="Fecha Solicitada" md-sort-by="fechaSolicitada">{{date(item.fecha)}}</md-table-cell>
        <md-table-cell md-label="Estado" md-sort-by="estado">{{ item.status }}</md-table-cell>
      </md-table-row>
    </md-table>
    <!-- ------------------------------------------------------------------------------------------- -->
    <!-- -------------------------------BOTON AGREGAR SOLICITUD EMPLEADO------------------------------- -->
    <md-speed-dial :class="bottomPosition">
      <md-speed-dial-target @click="showDialog=true">
        <md-icon>add</md-icon>
      </md-speed-dial-target>
    </md-speed-dial>
    <!-- ------------------------------------------------------------------------------------------- -->

    <!------------------------------------------- DIALOGO AGREGAR SOLICITUD EMPLEADO ----------------------------------->
    <md-dialog :md-active.sync="showDialog">
      <div>
        <form novalidate class="md-layout" @submit.prevent="validateUser">
          <md-card class="md-layout-item">
            <md-card-header>
              <div class="md-title">Crear Solicitud</div>
            </md-card-header>

            <md-card-content>
              <div class="md-layout md-gutter">
                <div class="md-layout-item md-small-size-100">
                  <md-field :class="getValidationClass('periodo')">
                    <label for="periodo">Periodo</label>
                    <md-input
                      name="periodo"
                      id="periodo"
                      autocomplete="family-name"
                      v-model="form.periodo"
                      :disabled="sending"
                    />
                    <span
                      class="md-error"
                      v-if="!$v.form.periodo.required"
                    >The periodo is required</span>
                  </md-field>
                </div>
              </div>
              <div class="md-layout md-gutter">
                <div class="md-layout-item md-small-size-100">
                  <md-field :class="getValidationClass('fechaSolicitada')">
                    <md-datepicker
                      v-model="form.fechaSolicitada"
                      :md-disabled-dates="disabledDates"
                      md-immediately
                    >
                      <label>Fecha Solicitada</label>
                    </md-datepicker>
                    <span
                      class="md-error"
                      v-if="!$v.form.fechaSolicitada.required"
                    >The fechaSolicitada is required</span>
                  </md-field>
                </div>
              </div>
            </md-card-content>

            <md-progress-bar md-mode="indeterminate" v-if="sending" />

            <md-card-actions>
              <md-button class="md-primary" @click="showDialog = false">Close</md-button>
              <md-button type="submit" class="md-primary" :disabled="sending">Create user</md-button>
            </md-card-actions>
          </md-card>

          <md-snackbar :md-active.sync="userSaved">The user was saved with success!</md-snackbar>
        </form>
      </div>
    </md-dialog>
    <!-- ----------------------------------------------------------------------------------------------------------------------- -->
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
      empleadoId: null,
      fechaSolicitada: null,
      diasSolicitados: null,
      periodo: null,
      status:null
    },
    userSaved: false,
    sending: false,
    search: null,
    searched: [],
    users: [],
    user: null,
    showDialog: false,
    bottomPosition: "md-bottom-right",
    disabledDates: date => {
      const day = date.getDay();

      return day === 6 || day === 0;
    }
  }),
  validations: {
    form: {
      periodo: {
        required,
      },
      fechaSolicitada: {
        required
      },
      diasSolicitados: {
        required
      }
    }
  },
  methods: {
    getTodos() {
      axios
        .get("http://localhost:3000/solicitudesEmpleado", {})
        .then(response => {
          this.search = "";
          this.users = response.data;
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
  width: 30%;
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