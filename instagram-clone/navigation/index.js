import React from "react";
import { connect } from "react-redux";
import { View, Image, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";

import firebase from "../configs/firebase";
import { setAuthUser } from "../actions";

import TabNavigator from "./TabNavigator";
import AuthNavigator from "./AuthNavigator";

class AppNavigator extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isAuth: false,
      fetching: false,
      userRef: firebase.firestore().collection("users"),
    };
  }
  componentDidMount() {
    this.setState({ fetching: true, isAuth: false });
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.state.userRef
          .doc(user.uid)
          .get()
          .then((doc) => {
            this.props.dispatch(setAuthUser(doc.data()));
            this.setState({ isAuth: true });
          });
      } else {
        this.setState({ isAuth: false });
      }
      this.setState({ fetching: false });
    });
  }

  render() {
    return this.state.fetching ? (
      <View>
        <Text>test</Text>
      </View>
    ) : (
      <NavigationContainer>
        {this.state.isAuth && <TabNavigator />}
        {!this.state.isAuth && <AuthNavigator />}
      </NavigationContainer>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(null, mapDispatchToProps)(AppNavigator);
