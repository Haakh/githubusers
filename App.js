import React from "react";
import {
  StyleSheet,
  Text,
  Linking,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator
} from "react-native";
import _ from "lodash";
import styles from "./appstyles";

console.disableYellowBox = true;

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      queryText: "",
      isLoading: false
    };
    this.getUserFromQuery = _.debounce(this.onChangeText, 500);
  }

  componentDidMount() {
    this.getInitialUsers();
  }

  getInitialUsers = async data => {
    this.setState({
      isLoading: true
    });

    let response = await fetch(`https://api.github.com/users`);
    response = await response.json();
    console.log("allUsers", response);
    this.setState({
      users: response,
      isLoading: false
    });
  };

  onChangeText = async txt => {
    this.setState({
      isLoading: true
    });
    let response = await fetch(
      `https://api.github.com/search/users?q=${txt}+sort:repositories`
    );
    response = await response.json();
    this.setState({
      users: response.items,
      isLoading: false
    });
  };

  openExternalLink = url =>
    Linking.openURL(url).catch(err => console.error("An error occurred", err));

  keyExtractor = (item, index) => item.url;

  renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => this.openExternalLink(item.html_url)}
      style={styles.listContainer}
    >
      <Image
        source={{ uri: item.avatar_url }}
        style={{ height: 30, width: 30, borderRadius: 15 }}
      />
      <Text style={styles.rowText}>{item.login}</Text>
    </TouchableOpacity>
  );

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.searchBar}>
          <Image />
          <TextInput
            onChangeText={this.getUserFromQuery}
            autoCapitalize={"none"}
            underlineColorAndroid={"rgba(0,0,0,0)"}
            autoCorrect={false}
            placeholder={"Enter User name"}
            placeholderTextColor={"rgb(153,153,153)"}
            style={{}}
          />
        </View>
        <View
          style={[
            styles.align,
            {
              flex: 9,
              alignSelf: "stretch"
            }
          ]}
        >
          {this.state.isLoading ? (
            <ActivityIndicator />
          ) : (
            <FlatList
              data={this.state.users}
              extraData={this.state}
              style={{ flex: 1, width: "100%" }}
              keyExtractor={this.keyExtractor}
              renderItem={this.renderItem}
            />
          )}
        </View>
      </View>
    );
  }
}
