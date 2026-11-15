package com.lostlink.dto;

import java.util.List;

public class LinkBotDTO {

    public static class MessageRequest {
        private String message;
        private String context;

        public MessageRequest() {}
        public MessageRequest(String message, String context) {
            this.message = message;
            this.context = context;
        }

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }

        public String getContext() { return context; }
        public void setContext(String context) { this.context = context; }
    }

    public static class MessageResponse {
        private String reply;
        private String intent;
        private List<String> suggestions;
        private String actionLink;
        private String actionText;

        public MessageResponse() {}
        public MessageResponse(String reply, String intent, List<String> suggestions, String actionLink, String actionText) {
            this.reply = reply;
            this.intent = intent;
            this.suggestions = suggestions;
            this.actionLink = actionLink;
            this.actionText = actionText;
        }

        public String getReply() { return reply; }
        public void setReply(String reply) { this.reply = reply; }

        public String getIntent() { return intent; }
        public void setIntent(String intent) { this.intent = intent; }

        public List<String> getSuggestions() { return suggestions; }
        public void setSuggestions(List<String> suggestions) { this.suggestions = suggestions; }

        public String getActionLink() { return actionLink; }
        public void setActionLink(String actionLink) { this.actionLink = actionLink; }

        public String getActionText() { return actionText; }
        public void setActionText(String actionText) { this.actionText = actionText; }
    }
}
