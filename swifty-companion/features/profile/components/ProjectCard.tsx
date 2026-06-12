import { useTheme } from "@/hooks/useTheme";
import { useResponsive } from "@/hooks/useResponsive";
import { StyleSheet, Text, View } from "react-native";
import { ProjectUser } from "../types/type";

type ProjectCardProps = {
    project: ProjectUser
}

function getColorFromProject(project: ProjectUser, theme: any) {
    if (project.status === "in_progress") return "#FFA21A";
    if (project.status === "finished" && project["validated?"] === true) return "#2D9C17";
    if (project.status === "finished" && project["validated?"] === false) return theme.colors.primary;
    return theme.colors.primary;
}

function withOpacity(hex: string, opacity: number) {
    const alpha = Math.round(opacity * 255).toString(16).padStart(2, "0");
    return `${hex}${alpha}`;
}

function getRetryFormat(project: ProjectUser) {
    if (project.status === "finished" && project.occurrence === 0) return "One shot 🔥"
    return `${project.occurrence} ${project.occurrence <= 1 ? "Retry" : "Retries"}`
}

function getStatusFormat(project: ProjectUser) {
    if (project.status === "finished" && project["validated?"] === true) return "Completed"
    if (project.status === "finished" && project["validated?"] === false) return "Failed"
    if (project.status === "in_progress") return "In progress"
    return project.status
}

export default function ProjectCard({project} : ProjectCardProps) {
    const theme = useTheme();
    const { ms, hs, vs , isLandscape} = useResponsive();

    const status = getStatusFormat(project);
    const color = getColorFromProject(project, theme);
    const backColor = withOpacity(color, 0.2);
    const retry = getRetryFormat(project);

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            borderWidth: isLandscape? ms(1) : ms(2),
            marginVertical: ms(6),
            paddingVertical:ms(10),
            paddingHorizontal: ms(8),
            alignItems: "center",
            borderRadius: ms(4),
        },
        detailsContainer: {
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-evenly"
        },
        projectTitle: {
            fontWeight: "bold",
            marginBottom: ms(8),
            fontSize: isLandscape? ms(10) : ms(14),
        },
        detailsStatus: {
            width: "30%",
            fontWeight: "bold",
            fontSize: isLandscape? ms(10) : ms(14),
        },
        detailsGrade: {
            flex: 1,
            textAlign: "center",
            fontWeight: "bold",
            fontSize: isLandscape? ms(10) : ms(14),
        },
        detailsRetry: {
            width: "30%",
            textAlign: "right",
            fontWeight: "bold",
            fontSize: isLandscape? ms(10) : ms(14),
        }
    });

    return (
        <View style={[styles.container, { borderColor: color , backgroundColor: backColor}]}>
            <Text style={styles.projectTitle}>{project.project.name}</Text>
            <View style={styles.detailsContainer}>
                <Text style={[styles.detailsStatus, {color: color}]}>{status}</Text>
                <Text style={[styles.detailsGrade, {color: color}]}>{project.final_mark !== null ? project.final_mark : "_"}</Text>
                <Text style={[styles.detailsRetry, {color: color}]}>{retry}</Text>
            </View>
        </View>
    );
}