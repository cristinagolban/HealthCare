import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Modal,
  TouchableOpacity
} from "react-native";
import * as firebase from "firebase";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";

var emailother = "";
var passwordother = "";

export default class Login extends React.Component {
  constructor() {
    super();

    this.state = {
      email: "",
      password: "",
      errorMessage: null,
      typeOfUser: "",
      isModalVisible: true,
      isUserFound: false,
      isPasswordFound: false,
    };
  }

  storeEmail = async () => {
    try {
      await AsyncStorage.setItem("email", this.state.email);
    } catch (e) {}
  };
 
  handleLogin = () => {
    if (this.state.typeOfUser === "doctor") {
      this.getDataFromDatabaseDoctor();
    } else if (this.state.typeOfUser === "user") {
      this.getDataFromAuth();
    } else if (this.state.typeOfUser === "asistenta") {
      this.getDataFromDatabaseAsistenta();
    }
  };

  getDataFromAuth = () => {
    firebase
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(() => this.props.navigation.navigate("User"))
      .catch((error) => this.setState({ errorMessage: error.message }));
    this.storeEmail();
  };

  getDataFromDatabaseDoctor = () => {
    emailother = this.state.email;
    passwordother = this.state.password;
    firebase
      .database()
      .ref("/doctor")
      .once("value")
      .then((snapshot) => {
        snapshot.forEach((childSnapshot) => {
          if (
            childSnapshot.val().email === emailother &&
            childSnapshot.val().password === passwordother
          ) {
            this.props.navigation.navigate("HomeDoctor");
          }
        });
      })
      .catch(function (error) {
        console.log(
          "There has been a problem with your fetch operation: " + error.message
        );
        // ADD THIS THROW error
        throw error;
      });
      this.storeEmail();
  };

  getDataFromDatabaseAsistenta = () => {
    emailother = this.state.email;
    passwordother = this.state.password;
    firebase
      .database()
      .ref("/asistenta")
      .once("value")
      .then((snapshot) => {
        snapshot.forEach((childSnapshot) => {
          if (
            childSnapshot.val().email === emailother &&
            childSnapshot.val().password === passwordother
          ) {
            this.props.navigation.navigate("Asistenta");
          }
        });
      })
      .catch(function (error) {
        console.log(
          "There has been a problem with your fetch operation: " + error.message
        );
        // ADD THIS THROW error
        throw error;
      });
  };

  render() {
    return (
      <View style={styles.container}>
        <Modal
          animationType="slide"
          visible={this.state.isModalVisible}
          transparent={true}
        >
          <View
            style={{
              height: "74%",
              justifyContent: "center",
              alignItems: "center",
              marginVertical: "13%",
            }}
          >
            <View
              style={{
                height: "85%",
                backgroundColor: "white",
                borderRadius: 20,
                width: "95%",
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 4,
                elevation: 5,
              }}
            >
              <Text
                style={{
                  fontSize: 24,
                  textAlign: "center",
                  fontWeight: "bold",
                  marginTop: "5%",
                  color: "#2a6049",
                }}
              >
                Alege tipul de user
              </Text>
              <View
                style={{
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: "5%",
                }}
              >
                <TouchableOpacity
                  onPress={() =>
                    this.setState({
                      isModalVisible: false,
                      typeOfUser: "doctor",
                    })
                  }
                  style={{ marginTop: "5%", width: "75%" }}
                >
                  <View style={{ alignItems: "center" }}>
                    <MaterialCommunityIcons
                      name={"doctor"}
                      size={100}
                      color={"#2a6049"}
                    />
                    <Text
                      style={{
                        fontSize: 18,
                        textAlign: "center",
                        fontWeight: "bold",
                        color: "#2a6049",
                      }}
                    >
                      Doctor
                    </Text>
                  </View>
                </TouchableOpacity>

                <View
                  style={{
                    borderWidth: 0.5,
                    borderColor: "grey",
                    width: "75%",
                    marginVertical: "5%",
                  }}
                ></View>

                <TouchableOpacity
                  onPress={() =>
                    this.setState({
                      isModalVisible: false,
                      typeOfUser: "asistenta",
                    })
                  }
                >
                  <MaterialCommunityIcons
                    name={"mother-nurse"}
                    size={100}
                    color={"#2a6049"}
                  />
                  <Text
                    style={{
                      fontSize: 18,
                      textAlign: "center",
                      fontWeight: "bold",
                      color: "#2a6049",
                    }}
                  >
                    Asistent
                  </Text>
                </TouchableOpacity>

                <View
                  style={{
                    borderWidth: 0.5,
                    borderColor: "grey",
                    width: "75%",
                    marginVertical: "5%",
                  }}
                ></View>

                <TouchableOpacity
                  onPress={() =>
                    this.setState({ isModalVisible: false, typeOfUser: "user" })
                  }
                >
                  <MaterialCommunityIcons
                    name={"account"}
                    size={100}
                    color={"#2a6049"}
                  />
                  <Text
                    style={{
                      fontSize: 18,
                      textAlign: "center",
                      fontWeight: "bold",
                      color: "#2a6049",
                    }}
                  >
                    User
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Text
          style={{
            color: "#2a6049",
            fontFamily: "bold-font",
            fontSize: 30,
            marginBottom: "5%",
          }}
        >
          Login
        </Text>
        {this.state.errorMessage && (
          <Text style={{ color: "red" }}>{this.state.errorMessage}</Text>
        )}
        <View
          style={{
            backgroundColor: "#2a6049",
            flexDirection: "row",
            borderRadius: 20,
            alignItems: "center",
            height: 50,
            width: "85%",
            marginTop: "3%",
          }}
        >
          <TextInput
            placeholder="Email"
            placeholderTextColor="white"
            autoCapitalize="none"
            style={styles.textInput}
            onChangeText={(email) => this.setState({ email })}
            value={this.state.email}
          />
        </View>
        <View
          style={{
            backgroundColor: "#2a6049",
            flexDirection: "row",
            borderRadius: 20,
            alignItems: "center",
            height: 50,
            width: "85%",
            marginTop: "3%",
          }}
        >
          <TextInput
            secureTextEntry
            placeholder="Password"
            placeholderTextColor="white"
            autoCapitalize="none"
            style={styles.textInput}
            onChangeText={(password) => this.setState({ password })}
            value={this.state.password}
          />
        </View>
        <TouchableOpacity
          onPress={this.handleLogin}
          style={{
            backgroundColor: "#2a6049",
            marginTop: "5%",
            borderRadius: 20,
            height: 40,
            justifyContent: "center",
            alignItems: "center",
            width: "35%",
          }}
        >
          <Text
            style={{ color: "white", fontSize: 18, fontFamily: "normal-font" }}
          >
            Login
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate("SignUp")}
          style={{
            marginTop: "5%",
            borderRadius: 20,
            height: 40,
            width: "35%",
          }}
        >
          <Text
            style={{
              color: "black",
              fontSize: 14,
              fontFamily: "normal-font",
              textAlign: "center",
            }}
          >
            Don't have an account?{" "}
            <Text
              style={{
                color: "#2a6049",
                fontSize: 14,
                fontFamily: "bold-font",
              }}
            >
              SIGN UP
            </Text>
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  textInput: {
    color: "white",
    width: "90%",
    marginHorizontal: "5%",
    fontSize: 16,
    fontFamily: "normal-font",
  },
});
