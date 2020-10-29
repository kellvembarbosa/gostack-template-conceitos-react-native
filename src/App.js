import React, { useEffect, useState } from "react";
import api from "./services/api"

import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity
} from "react-native";

export default function App() {
  const [repositories, setRepositories] = useState([])

  async function initData() {
    const response = await api.get('/repositories');
    if (response.data)
      setRepositories(response.data)
  }

  useEffect(() => {
    initData();
  }, [])

  async function handleLikerepositories(id) {
    const response = await api.post(`/repositories/${id}/like`)
    if (response.status === 200) {
      setRepositories(repositories.map(repo => repo.id === id ? { ...repo, likes: response?.data?.likes } : repo))
    }
  }

  async function handleRemoveRepositories(id) {
    const response = await api.delete(`/repositories/${id}`)
    if (response.status === 204) {
      const repositoryIndex = repositories.findIndex(repo => repo.id === id)
      repositories.splice(repositoryIndex, 1);
      setRepositories([...repositories])
    }
  }
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      <SafeAreaView style={styles.container}>
        {repositories.length === 0 ? (
          <View style={styles.containerNoResults}>
            <Text style={styles.noResult}>
              Nenhum repositório encontrado!
            </Text>
            <TouchableOpacity style={styles.button} onPress={initData}>
              <Text style={styles.buttonUpdateText}>Atualizar</Text>
            </TouchableOpacity>
          </View>
        ) : (
            <FlatList
              data={repositories}
              keyExtractor={repository => repository.id}
              renderItem={({ item:repository }) => {

                return (
                  <View key={repository.id} style={styles.repositoriesContainer}>
                    <Text style={styles.repositories}>{repository.title}</Text>

                    <View style={styles.techsContainer}>
                      {repository.length > 0 && item.map((techs, index) => (

                        <Text key={index} style={styles.tech}>
                          { techs }
                        </Text>
                      ))}
                    </View>

                    <View style={styles.likesContainer}>
                      <Text
                        style={styles.likeText}
                        // Remember to replace "1" below with repositories ID: {`repositories-likes-${repositories.id}`}
                        testID={`repository-likes-${repository.id}`}>
                        {repository.likes} curtidas
                        </Text>
                    </View>

                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => handleLikerepositories(repository.id)}
                      // Remember to replace "1" below with repositories ID: {`like-button-${repositories.id}`}
                      testID={`like-button-${repository.id}`}>
                      <Text style={styles.buttonText}>Curtir</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => handleRemoveRepositories(repository.id)}
                    // Remember to replace "1" below with repositories ID: {`like-button-${repositories.id}`}
                    >
                      <Text style={styles.buttonDeleteText}>Deletar</Text>
                    </TouchableOpacity>
                  </View>
                )
              }}
            />
          )}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7159c1"
  },
  repositoriesContainer: {
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: "#fff",
    padding: 20,
  },
  repositories: {
    fontSize: 32,
    fontWeight: "bold",
  },
  techsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  tech: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
    backgroundColor: "#04d361",
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#fff",
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  likeText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
  },
  button: {
    marginTop: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
    color: "#fff",
    backgroundColor: "#7159c1",
    padding: 15,
  },
  buttonDeleteText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
    color: "#fff",
    backgroundColor: "#ff5e56",
    padding: 15,
  },
  buttonUpdateText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
    color: "#fff",
    backgroundColor: "#0067ff",
    padding: 15,
  },
  containerNoResults: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  noResult: {
    textAlign: "center",
    fontSize: 32,
    color: "#fff",
  }
});
