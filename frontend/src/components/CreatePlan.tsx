import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { Ionicons } from '@expo/vector-icons';
import { getCommonStyles } from '../styles/themeStyles';
import { Theme } from '../types/theme';

interface CreatePlanProps {
    onGenerate: (goal: string, timeHorizon: 'today' | 'week') => void;
    loading: boolean;
    theme: Theme;
}

const CreatePlan: React.FC<CreatePlanProps> = ({ onGenerate, loading, theme }) => {
    const [goal, setGoal] = useState('');
    const [open, setOpen] = useState(false);
    const [timeHorizon, setTimeHorizon] = useState<'today' | 'week'>('today');
    const [items, setItems] = useState([
        { label: 'Today', value: 'today' },
        { label: 'This Week', value: 'week' },
    ]);

    const common = getCommonStyles(theme);

    const handleGenerate = () => {
        if (!goal.trim()) {
            Alert.alert('Please enter a goal.');
            return;
        }
        onGenerate(goal.trim(), timeHorizon);
    };

    return (
        <View style={[common.container, localStyles.container]}>
             <View style={{ marginBottom: 96, alignItems: 'center' }}>
                <Text style={common.heading}>Welcome to PlanBuddy!</Text>
                <Text style={common.text} >Your AI-powered personal planning assistant</Text>
            </View>
            <View style={{ marginBottom: 16 }}>
                <Text style={common.label}>What is your goal?</Text>
                <TextInput
                    style={common.input}
                    placeholder="e.g. Get ready to launch an ecommerce store"
                    value={goal}
                    onChangeText={setGoal}
                    editable={!loading}
                    accessibilityLabel="Goal input"
                    placeholderTextColor={theme.placeholder}
                />
            </View>

            <Text style={common.label}>Time Horizon</Text>
            <DropDownPicker
                open={open}
                value={timeHorizon}
                items={items}
                setOpen={setOpen}
                setValue={setTimeHorizon}
                setItems={setItems}
                disabled={loading}
                style={[localStyles.dropdown, { backgroundColor: theme.background, borderColor: theme.border }]}
                dropDownContainerStyle={[localStyles.dropdownContainer, { borderColor: theme.border, backgroundColor: theme.card }]}
                textStyle={{ color: theme.text }}
                 TickIconComponent={() => <Ionicons name="checkmark" size={20} color={theme.primary} />}
            />

            <Button
                title={loading ? 'Generating...' : 'Generate Plan'}
                onPress={handleGenerate}
                disabled={loading}
                accessibilityLabel="Generate plan button"
                color={theme.primary}
            />
        </View>
    );
};

const localStyles = StyleSheet.create({
    container: { justifyContent: 'flex-start', padding: 24 },
    dropdown: {
        borderColor: '#ccc',
        borderRadius: 6,
        marginTop: 4,
        marginBottom: 24,
    },
    dropdownContainer: {
        borderColor: '#ccc',
    },
});

export default CreatePlan;
