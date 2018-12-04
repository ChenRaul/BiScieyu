import {Component} from "react";
import {View, TextInput, StyleSheet, Text} from "react-native";
import React from "react";


class CustomTextInput extends Component {

    constructor(props) {
        super(props)
        this.state = {
            value: this.props.value && ""
        };
    }

    /**
     *
     */
    onChangeValue(value){
        this.props.changeValue(value);
        this.setState({
            value
        });
    }

    render() {
        const { label } = this.props;
        return (<View>
                <Text>{label}</Text>
                <TextInput onChangeText={(text) => this.onChangeValue(text)} value={this.state.text} style={styles.items}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    items: {
        borderColor: "red",
        borderWidth: 2
    }
})

export default CustomTextInput;