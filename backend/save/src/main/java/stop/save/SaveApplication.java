package stop.save;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class SaveApplication {

	public static void main(String[] args) {
		SpringApplication.run(SaveApplication.class, args);
	}

}
