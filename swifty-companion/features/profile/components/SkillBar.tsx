import { useTheme } from "@/hooks/useTheme";
import { useResponsive } from "@/hooks/useResponsive";
import { StyleSheet, Text, View } from "react-native";
import { SkillBarProps } from "../types/type";


export default function SkillBar({ skill} : SkillBarProps) {
    const theme = useTheme();
    const { ms, hs, vs , isLandscape} = useResponsive();
    const percent = Math.min((skill.level / 21) * 100, 100);

    const styles = StyleSheet.create({
        container: {
            height: isLandscape? ms(30) : ms(50),
            flexDirection: "row",
            alignItems: "center",
            marginBottom: isLandscape? ms(0) : ms(0),
        },
        skillHeader: {
            width: "32%",
        },
        barContainer: {
            flex: 1,
            height: isLandscape ? ms(12) : ms(16),
            justifyContent: "center",
            backgroundColor: theme.colors.background,
            borderColor: theme.colors.primary,
            borderWidth: ms(1),
            borderRadius: ms(6),
            overflow: "hidden",
        },
        barFill: {
            height: "100%",
            backgroundColor: theme.colors.primary,
            borderTopRightRadius: ms(6),
            borderBottomRightRadius: ms(6),
        },
        name: {
            fontSize: isLandscape? ms(10) : ms(14),
        },
        stats: {
            width: "28%",
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center",
            marginStart: ms(8),
        },
        level: {
            color: theme.colors.text,
            fontSize: isLandscape? ms(10) : ms(14),
            fontWeight: "bold",
        },
        percent: {
            color: theme.colors.primary,
            fontSize: isLandscape? ms(10) : ms(14),
            fontWeight: "bold",
            marginStart: ms(6),
        }
    });
    
    return (
        <View style={styles.container}>
            <View style={styles.skillHeader}>
                <Text style={styles.name}>{skill.name}</Text>
            </View>

            <View style={styles.barContainer}>
                <View style={[styles.barFill, { width: `${percent}%` }]} />
            </View>

            <View style={styles.stats}>
                <Text style={styles.level}>
                    {isLandscape ? "Level" : ""}{skill.level.toFixed(2)}
                </Text>
                <Text style={styles.percent}>{percent.toFixed(0)}%</Text>
            </View>
        </View>
    );
}