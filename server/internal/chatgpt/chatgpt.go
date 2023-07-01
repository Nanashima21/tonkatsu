package chatgpt

import (
	"bytes"
	"encoding/json"
	"io"
	"io/ioutil"
	"net/http"
	"regexp"
	"strings"
)

type OpenaiRequest struct {
	Model    string    `json:"model"`
	Messages []Message `json:"messages"`
}

type OpenaiResponse struct {
	ID      string   `json:"id"`
	Object  string   `json:"object"`
	Created int      `json:"created"`
	Choices []Choice `json:"choices"`
	Usages  Usage    `json:"usage"`
}

type Choice struct {
	Index        int     `json:"index"`
	Messages     Message `json:"message"`
	FinishReason string  `json:"finish_reason"`
}

type Message struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

type Usage struct {
	PromptTokens     int `json:"prompt_tokens"`
	CompletionTokens int `json:"completion_tokens"`
	TotalTokens      int `json:"total_tokens"`
}

func CallChatGPT(message string) string {
	apiKey := "YOUR_API_KEY" // SET YOUR API KEY
	var messages []Message
	messages = append(messages, Message{
		Role:    "user",
		Content: message,
	})

	requestBody := OpenaiRequest{
		Model:    "gpt-3.5-turbo",
		Messages: messages,
	}

	requestJSON, _ := json.Marshal(requestBody)

	req, err := http.NewRequest("POST", "https://api.openai.com/v1/chat/completions", bytes.NewBuffer(requestJSON))
	if err != nil {
		panic(err)
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+apiKey)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		panic(err)
	}
	defer func(Body io.ReadCloser) {
		err := Body.Close()
		if err != nil {
			panic(err)
		}
	}(resp.Body)

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		panic(err)
	}

	var response OpenaiResponse
	err = json.Unmarshal(body, &response)
	if err != nil {
		println("Error: ", err.Error())
		return "FAILED"
	}

	messages = append(messages, Message{
		Role:    "assistant",
		Content: response.Choices[0].Messages.Content,
	})

	return response.Choices[0].Messages.Content
}

func AskChatGPT(keyword string) []string {
	prompt := "[[KEYWORD]]に関する説明を5箇条で書いてください。日本語で書いてください。極めて抽象的に記述してください。[[KEYWORD]]という言葉は絶対に使わないでください。"
	prompt = strings.Replace(prompt, "[[KEYWORD]]", keyword, -1)
	response := CallChatGPT(prompt)

	response = MaskKeyword(response, keyword)
	response_slice := SplitMessage(response)
	return response_slice
}

func SplitMessage(message string) []string {
	reg := "[\n]"

	// 正規表現で文字列をスプリット
	message_slice := regexp.MustCompile(reg).Split(message, -1)
	var refined_slice []string
	for _, v := range message_slice {
		if v != "" {
			refined_slice = append(refined_slice, v)
		}
	}

	return refined_slice
}

func MaskKeyword(message string, keyword string) string {
	return strings.Replace(message, keyword, "[[MASK]]", -1)
}
