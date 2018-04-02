import React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TextInput,
  ActivityIndicator
} from "react-native";
import _ from "lodash";

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

  keyExtractor = (item, index) => item.url;

  renderItem = ({ item }) => (
    <View
      style={[
        styles.align,
        { alignSelf: "stretch", flexDirection: "row", height: 50 }
      ]}
    >
      <Image
        source={{ uri: item.avatar_url }}
        style={{ height: 30, width: 30, borderRadius: 15 }}
      />
      <Text>{item.login}</Text>
    </View>
  );

  getInitialUsers = async data => {
    this.setState({
      isLoading: true
    });

    let response = await fetch(`https://api.github.com/users?since=0`);
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
    let response = await fetch(`https://api.github.com/search/users?q=${txt}`);
    response = await response.json();
    this.setState({
      users: response.items,
      isLoading: false
    });
  };

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
              style={{ borderWidth: 1, alignSelf: "stretch" }}
              keyExtractor={this.keyExtractor}
              renderItem={this.renderItem}
            />
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    marginTop: 22,
    justifyContent: "center"
  },
  align: {
    alignItems: "center",
    justifyContent: "center"
  },
  searchBar: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 3,
    marginTop: "3%",
    alignSelf: "stretch",
    borderBottomWidth: 1,
    borderColor: "#c9c9c9"
  }
});
