<template>
  <div id="app">
    <md-toolbar class="md-primary" md-elevation="1">
      <h3 class="md-title" style="flex: 1">Empleados</h3>
      <md-button @click.prevent="logut">Cerrar Sesión</md-button>
      <router-link to="/solicitudes">
        <md-button class="md-primary">Solicitudes</md-button>
      </router-link>
      <router-link to="/empleados">
        <md-button class="md-primary">Empleados</md-button>
      </router-link>
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
          <h1 class="md-title">EMPLEADOS</h1>
        </div>
        <!--         <md-field md-clearable class="md-toolbar-section-end">
          <md-input placeholder="Buscar por nombre..." v-model="search" @input="searchOnTable" />
        </md-field>
        -->
      </md-table-toolbar>

      <!--  <md-table-empty-state
        md-label="No se encontro el empleado"
        :md-description="`No se encontraron coincidencias. Intenta con un nombre diferente o crea un usuario con ese nombre.`"
      >
        <md-button class="md-primary md-raised" @click="showDialog=true">Crear usuario</md-button>
      </md-table-empty-state>-->

      <md-table-row slot="md-table-row" v-for="i in users" :key="i.id">
        <md-table-cell md-label="Id" md-sort-by="id">{{i.id}}</md-table-cell>
        <md-table-cell md-label="Nombre" md-sort-by="nombre">{{i.nombre}}</md-table-cell>
        <md-table-cell md-label="Apellido" md-sort-by="apellido">{{ i.apellido }}</md-table-cell>
        <md-table-cell md-label="Fecha Ingreso" md-sort-by="fechaIngreso">{{date(i.fechaIngreso)}}</md-table-cell>
        <md-table-cell
          md-label="Fecha Nacimiento"
          md-sort-by="fechaNacimiento"
        >{{date(i.fechaNacimiento)}}</md-table-cell>
        <md-table-cell md-label="Email" md-sort-by="email">{{ i.email }}</md-table-cell>
        <md-table-cell md-label="DPI" md-sort-by="dpi">{{ i.dpi }}</md-table-cell>
        <md-table-cell>
          <md-button
            class="md-icon-button md-primary"
            @click.prevent="showDialogEditar=true"
            @click="getEmpleado(i.id)"
          >
            <md-icon>edit</md-icon>
          </md-button>
          <md-button class="md-icon-button md-accent" @click="deleteUser(i.id)">
            <md-icon>delete</md-icon>
          </md-button>
        </md-table-cell>
      </md-table-row>
    </md-table>
    <!-- ------------------------------------------------------------------------------------------- -->
    <!-- -------------------------------BOTON AGREGAR EMPLEADO------------------------------- -->
    <md-speed-dial :class="bottomPosition">
      <md-speed-dial-target @click="showDialogAgregar=true">
        <md-icon>add</md-icon>
      </md-speed-dial-target>
    </md-speed-dial>
    <!-- ------------------------------------------------------------------------------------------- -->

    <!------------------------------------------- DIALOGO AGREGAR EMPLEADO ----------------------------------->
    <md-dialog :md-active.sync="showDialogAgregar" ref="formAgregarDialogo">
      <div>
        <form novalidate class="md-layout" @submit.prevent="validateUser">
          <md-card class="md-layout-item">
            <md-card-header>
              <div class="md-title">Crear Empleado</div>
            </md-card-header>

            <md-card-content>
              <div class="md-layout md-gutter">
                <div class="md-layout-item">
                  <md-field :class="getValidationClass('nombre')">
                    <label for="first-name">Nombre(s)</label>
                    <md-input
                      name="first-name"
                      id="first-name"
                      autocomplete="given-name"
                      v-model="form.nombre"
                      :disabled="sending"
                    />
                    <span
                      class="md-error"
                      v-if="!$v.form.nombre.required"
                    >The first name is required</span>
                    <span class="md-error" v-else-if="!$v.form.nombre.minlength">Invalid first name</span>
                  </md-field>
                </div>

                <div class="md-layout-item md-small-size-100">
                  <md-field :class="getValidationClass('apellido')">
                    <label for="last-name">Apellido(s)</label>
                    <md-input
                      name="last-name"
                      id="last-name"
                      autocomplete="family-name"
                      v-model="form.apellido"
                      :disabled="sending"
                    />
                    <span
                      class="md-error"
                      v-if="!$v.form.apellido.required"
                    >The last name is required</span>
                    <span class="md-error" v-else-if="!$v.form.apellido.minlength">Invalid last name</span>
                  </md-field>
                </div>
              </div>
              <div class="md-layout md-gutter">
                <div class="md-layout-item md-small-size-100">
                  <md-field :class="getValidationClass('dpi')">
                    <label for="dpi">DPI</label>
                    <md-input
                      type="number"
                      id="dpi"
                      name="dpi"
                      autocomplete="dpi"
                      v-model="form.dpi"
                      :disabled="sending"
                    />
                    <span class="md-error" v-if="!$v.form.dpi.required">The dpi is required</span>
                    <span class="md-error" v-else-if="!$v.form.dpi.minlength">Invalid dpi</span>
                    <span class="md-error" v-else-if="!$v.form.dpi.maxlength">Invalid dpi</span>
                  </md-field>
                </div>
                <div class="md-layout-item md-small-size-100">
                  <md-field :class="getValidationClass('email')">
                    <label for="email">Email</label>
                    <md-input
                      type="email"
                      name="email"
                      id="email"
                      autocomplete="email"
                      v-model="form.email"
                      :disabled="sending"
                    />
                    <span class="md-error" v-if="!$v.form.email.required">The email is required</span>
                    <span class="md-error" v-else-if="!$v.form.email.email">Invalid email</span>
                  </md-field>
                </div>
              </div>
              <div class="md-layout md-gutter">
                <div class="md-layout-item md-small-size-100">
                  <md-field :class="getValidationClass('fechaIngreso')">
                    <md-datepicker
                      v-model="form.fechaIngreso"
                      :md-disabled-dates="disabledDates"
                      md-immediately
                    >
                      <label>Fecha de Ingreso</label>
                    </md-datepicker>
                    <span
                      class="md-error"
                      v-if="!$v.form.fechaIngreso.required"
                    >The fechaIngreso is required</span>
                  </md-field>
                </div>
                <div class="md-layout-item md-small-size-100">
                  <md-field :class="getValidationClass('fechaNacimiento')">
                    <md-datepicker v-model="form.fechaNacimiento" md-immediately>
                      <label for="fechaNacimiento">Fecha De Nacimiento</label>
                    </md-datepicker>
                    <span
                      class="md-error"
                      v-if="!$v.form.fechaNacimiento.required"
                    >The fechaNacimiento is required</span>
                  </md-field>
                </div>
              </div>
              <div class="md-layout-item">
                <md-field>
                  <md-select v-model="form.rol" name="rol" id="rol" placeholder="Rol">
                    <md-option value="admin">Administrador Principal</md-option>
                    <md-option value="empleado">Empleado</md-option>
                  </md-select>
                </md-field>
              </div>
            </md-card-content>

            <md-progress-bar md-mode="indeterminate" v-if="sending" />

            <md-card-actions>
              <md-button
                class="md-primary"
                @click="showDialogAgregar = false"
                @click.prevent="clearForm"
              >Close</md-button>
              <md-button type="submit" class="md-primary" :disabled="sending">Create user</md-button>
            </md-card-actions>
          </md-card>

          <md-snackbar :md-active.sync="userSaved">The user was saved with success!</md-snackbar>
        </form>
      </div>
    </md-dialog>
    <!-- ----------------------------------------------------------------------------------------------------------------------- -->

    <!------------------------------------------- DIALOGO EDITAR EMPLEADO ----------------------------------->
    <md-dialog :md-active.sync="showDialogEditar" ref="formEditarDialogo">
      <div>
        <form novalidate class="md-layout-edit" @submit.prevent="validateUser">
          <md-card class="md-layout-item">
            <md-card-header>
              <div class="md-title">Editar Empleado</div>
            </md-card-header>

            <md-card-content>
              <div class="md-layout md-gutter">
                <div class="md-layout-item">
                  <md-field :class="getValidationClass('nombre')">
                    <label for="first-name">Nombre(s)</label>
                    <md-input
                      name="first-name"
                      id="first-name"
                      autocomplete="given-name"
                      v-model="form.nombre"
                      :disabled="sending"
                    />
                    <span
                      class="md-error"
                      v-if="!$v.form.nombre.required"
                    >The first name is required</span>
                    <span class="md-error" v-else-if="!$v.form.nombre.minlength">Invalid first name</span>
                  </md-field>
                </div>

                <div class="md-layout-item md-small-size-100">
                  <md-field :class="getValidationClass('apellido')">
                    <label for="last-name">Apellido(s)</label>
                    <md-input
                      name="last-name"
                      id="last-name"
                      autocomplete="family-name"
                      v-model="form.apellido"
                      :disabled="sending"
                    />
                    <span
                      class="md-error"
                      v-if="!$v.form.apellido.required"
                    >The last name is required</span>
                    <span class="md-error" v-else-if="!$v.form.apellido.minlength">Invalid last name</span>
                  </md-field>
                </div>
              </div>
              <div class="md-layout md-gutter">
                <div class="md-layout-item md-small-size-100">
                  <md-field :class="getValidationClass('fechaNacimiento')">
                    <md-datepicker v-model="form.fechaNacimiento" md-immediately>
                      <label for="fechaNacimiento">Fecha De Nacimiento</label>
                    </md-datepicker>
                    <span
                      class="md-error"
                      v-if="!$v.form.fechaNacimiento.required"
                    >The fechaNacimiento is required</span>
                  </md-field>
                </div>
                <div class="md-layout-item">
                  <md-field>
                    <md-select v-model="form.rol" name="rol" id="rol" placeholder="Rol">
                      <md-option value="admin">Administrador Principal</md-option>
                      <md-option value="empleado">Empleado</md-option>
                    </md-select>
                  </md-field>
                </div>
              </div>
            </md-card-content>

            <md-progress-bar md-mode="indeterminate" v-if="sending" />

            <md-card-actions>
              <md-button
                class="md-primary"
                @click="showDialogEditar = false"
                @click.prevent="clearForm"
              >Close</md-button>
              <md-button type="submit" class="md-primary" :disabled="sending" @click="editUser()">Save Changes</md-button>
            </md-card-actions>
          </md-card>

          <md-snackbar
            :md-active.sync="userSaved"
            :md-desactive.sync="showDialogEditar"
          >The user was saved with success!</md-snackbar>
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
    return items.filter(i => toLower(i.nombre).includes(toLower(term)));
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
      email: null,
      dpi: null,
      fechaIngreso: null,
      fechaNacimiento: null,
      rol: null
    },
    id:null,
    userSaved: false,
    sending: false,
    search: null,
    searched: [],
    users: [],
    user: null,
    showDialog: false,
    showDialogEditar: false,
    showDialogAgregar: false,
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
      axios
        .get("http://localhost:3000/empleados", {})
        .then(response => {
          this.search = "";
          this.users = response.data;
          this.user = localStorage.user;
        })

        .catch(e => console.log(e));
    },
    getEmpleado(id) {
      axios
        .get("http://localhost:3000/empleado/" + id, {})
        .then(response => {
          console.log(response.data);
          this.search = "";
          this.form.nombre = response.data.nombre;
          this.form.apellido = response.data.apellido;
          this.form.fechaNacimiento = moment(
            String(response.data.fechaNacimiento)
          ).format("YYYY-MM-DD");
          this.form.rol = response.data.usuario.rol;
          this.id=response.data.id
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
      this.form.rol = null;
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
          fechaIngreso: this.form.fechaIngreso,
          rol: this.form.rol
        })
        .then(response => {
          // eslint-disable-next-line
          console.log(response.data);
          window.setTimeout(() => {
            this.userSaved = true;
            this.sending = false;
            this.clearForm();
            this.users = this.users;
          }, 1500);
          this.getTodos();
          this.showDialogAgregar = false;
        })
        .catch(e => {
          console.log("no se pudo agregar");
          console.log(e);
        });
      this.getTodos();
    },
    editUser() {
      this.sending = true;
      console.log('id');
      // Instead of this timeout, here you can call your API
      axios
        .put("http://localhost:3000/editarEmpleado/" + this.id, {
          nombre: this.form.nombre,
          apellido: this.form.apellido,
          fechaNacimiento: this.form.fechaNacimiento,
          rol: this.form.rol
        })
        .then(response => {
          // eslint-disable-next-line
          console.log(response.data);
          window.setTimeout(() => {
            this.userSaved = true;
            this.sending = false;
            this.clearForm();
            this.users = this.users;
            this.showDialog = false;
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
          this.getTodos();
          console.log(response.data);
        })
        .catch(e => {
          console.log("no se pudo eliminar");
          console.log(e);
        });
    },
    validateUser() {
      this.$v.$touch();

      if (!this.$v.$invalid) {
        this.saveUser();
      }
    },
    validateEditUser() {
      this.$v.$touch();

      if (!this.$v.$invalid) {
        this.editUser();
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
  text-align: center;
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