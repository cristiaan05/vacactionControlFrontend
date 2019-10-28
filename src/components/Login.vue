<template>
  <form class="centered-container"  @submit.prevent="login">
    <md-content class="md-elevation-3">
      <img
        src="https://uploads-ssl.webflow.com/56a1006de9a99a4669bfd05c/5bc49b720bc683b8ffabc6d7_Logo-ESC-SolutionS.png"
      />
        <md-field>
          <label>Usuario</label>
          <md-input v-model="usuario" autofocus></md-input>
        </md-field>

        <md-field md-has-password>
          <label>Password</label>
          <md-input v-model="password" type="password"></md-input>
        </md-field>

      <div class="actions md-layout md-alignment-center">
        <md-button type="submit" class="md-raised md-primary">Log in</md-button>
      </div>

      <div class="loading-overlay" v-if="loading">
        <md-progress-spinner md-mode="indeterminate" :md-stroke="2"></md-progress-spinner>
      </div>
    </md-content>
    <div class="background" />
  </form>
</template>
<script>
export default {
  name: "Login",
  data() {
    return {
      loading: false,
      usuario: "",
      password: ""
    };
  },
  methods: {
    login: function() {
      let usuario = this.usuario;
      let password = this.password;
      this.$store
        .dispatch("login", { usuario, password })
        .then((response) =>{
          console.log(response.data.user)
          if (response.data.user=='admin') {
          this.$router.push("/empleados")  
          } else if(response.data.user=='empleado') {
            this.$router.push("/perfilEmpleado")
          }
          
        } )
        .catch(err => console.log(err));
    }
  }
};
</script>

<style lang="scss">
.centered-container {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  height: 100vh;
  .title {
    text-align: center;
    margin-bottom: 30px;
    img {
      margin-bottom: 16px;
      max-width: 80px;
    }
  }
  .actions {
    .md-button {
      margin: 0;
    }
  }
  .form {
    margin-bottom: 60px;
  }
  .background {
    background: url(https://wallpaperaccess.com/full/1101309.jpg);
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    z-index: 0;
  }
  .md-content {
    z-index: 1;
    padding: 40px;
    width: 100%;
    max-width: 400px;
    position: relative;
  }
  .img{
    width:50%;
    height:50%;
  }
  .loading-overlay {
    z-index: 10;
    top: 0;
    left: 0;
    right: 0;
    position: absolute;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>